import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';
import Industry from '../industry/industry.entity';
import { Deal } from './deal.entity';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { UserService } from '../user/user.service';
import { Investment, InvestmentStatus } from '../investments/investments.entity';

@Injectable()
export class DealService {

    constructor(

        private cloudinaryService: CloudinaryService,

        private userService: UserService,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(InvestmentInstrument)
        private investmentInstrumentRepository: Repository<InvestmentInstrument>,

        @InjectRepository(Industry)
        private industryRepository: Repository<Industry>,

        @InjectRepository(Deal)
        private dealRepository: Repository<Deal>,

        @InjectRepository(InvitationTracker)
        private invitationTrackerRepository: Repository<InvitationTracker>,

        @InjectRepository(Investment)
        private investmentRepository: Repository<Investment>,

    ) { }



    async submitDeal(files: any, user: any, details: any): Promise<any> {


        console.log(details.investors[0])

        try {
            if (!files || !files.waterfall_distribution_structure || !files.angel_waterfall_distribution_structure) {
                throw new BadRequestException('All three files (spv, water fall structure, angel waterfall structure) are required');
            }

            const userExist = await this.userRepository.findOneBy({ id: user.data.user.id })

            if (!user) {
                throw new BadRequestException('user unauthorized');
            }


            const investmentInstrument = await this.investmentInstrumentRepository
                .createQueryBuilder('inv')
                .where('inv.id = :id', { id: details.investment_instrument_id })
                .getOne();


            if (!investmentInstrument) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'investment instrument do not exist',
                };
            }



            // check id type
            const startupInd = await this.industryRepository.findOne({ where: { id: details.startup_industry_id } })
            if (!startupInd) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'industry selected do not exist',
                };
            }


            // Upload files with error handling
            const uploadResults = await Promise.allSettled([
                this.uploadWithRetry(files.waterfall_distribution_structure[0], userExist.email),
                this.uploadWithRetry(files.angel_waterfall_distribution_structure[0], userExist.email)
            ]);

            // Extract results

            const waterfall_distribution_structure_url = uploadResults[0].status === 'fulfilled' ? uploadResults[0].value : null;
            const angel_waterfall_distribution_structure_url = uploadResults[1].status === 'fulfilled' ? uploadResults[1].value : null;

            // Check if any upload failed
            if (!waterfall_distribution_structure_url || !angel_waterfall_distribution_structure_url) {
                throw new Error('One or more document uploads failed. Please try again.');
            }

            const entityManager = this.dealRepository.manager;

            return await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {

                // Save deals details if all uploads are successful
                const deal = this.dealRepository.create({
                    user: userExist,
                    investment_instrument: { id: investmentInstrument.id },
                    startup_name: details.startup_name,
                    startup_industry: { id: startupInd.id },
                    founder_firstname: details.founder_firstname,
                    founder_lastname: details.founder_lastname,
                    founder_email: details.founder_email,
                    startup_website: details.startup_website,
                    funding_amount: details.funding_amount ? Number(details.funding_amount) : 0,
                    repayment_schedule_code: details.repayment_schedule_code,
                    disbursement_schedule_code: details.disbursement_schedule_code,
                    spv_code: details.spv_code,
                    spv_code: details.spv_code,
                    spv_name: details.spv_name,
                    investors: details.investors,
                    waterfall_distribution_structure: waterfall_distribution_structure_url,
                    angel_waterfall_distribution_structure: angel_waterfall_distribution_structure_url
                });

                // const createdDeal = await this.dealRepository.save(deal);
                const createdDeal = await transactionalEntityManager.save(Deal, deal);

                // create a founder user
                const founder = this.userRepository.create({
                    first_name: details.founder_firstname,
                    last_name: details.founder_lastname,
                    email: details.founder_email,
                    password: await this.userService.createPasswordHash(details.founder_email)
                })
                const createdFounder = await transactionalEntityManager.save(User, founder);

                // add founder to tracker
                const trackFounder = this.invitationTrackerRepository.create({
                    invited_by: { id: userExist.id },
                    invitee: { id: createdFounder.id },
                    deal: { id: createdDeal.id },
                    user_type: 'founder',
                })

                await transactionalEntityManager.save(InvitationTracker, trackFounder);

                const invitedInv = typeof details.investors === "string" ? JSON.parse(details.investors) : details.investors;
                // Precompute password hashes
                for (const invited of invitedInv) {
                    invited.passwordHash = await this.userService.createPasswordHash(invited.email);
                }

                // Create users and their investments
                const users = invitedInv.map((invited) => {
                    const user = this.userRepository.create({
                        first_name: invited.first_name,
                        last_name: invited.last_name,
                        email: invited.email,
                        password: invited.passwordHash,
                    });

                    return user;
                });

                const savedUsers = await transactionalEntityManager.save(User, users);

                // Now create investments for each user
                const investments = savedUsers.map((user: User, index: number) => {
                    const investmentAmount = invitedInv[index].amount; // Get the amount from invited data

                    const investment = this.investmentRepository.create({
                        user: user, // Set the user
                        deal: createdDeal, // Link to the current deal (assumed 'createdDeal' is the deal you're processing)
                        investment_amount: investmentAmount, // The amount to be invested
                        proposed_amount: investmentAmount, // You can adjust if you have a different proposed amount
                        investment_status: InvestmentStatus.PENDING, // Set the initial status
                        // Add any other relevant fields like currency, expected return, etc.
                    });

                    return investment;
                });

                // Save investments
                await transactionalEntityManager.save(Investment, investments);

                // Create invitation trackers
                const trackers = savedUsers.map((user) =>
                    this.invitationTrackerRepository.create({
                        invited_by: { id: userExist.id },
                        invitee: { id: user.id },
                        deal: { id: createdDeal.id },
                        user_type: 'investor',
                    })
                );
                await transactionalEntityManager.save(InvitationTracker, trackers);


                return {
                    status_code: 201,
                    error: false,
                    message: 'deals created succesfully',
                    data: {},
                };
            })
        } catch (error) {
            console.error('KYC Submission Error:', error);
            throw new BadRequestException({ message: error.message });
        }
    }

    async uploadWithRetry(file: any, email: string, attempts = 3): Promise<string> {
        for (let i = 0; i < attempts; i++) {
            try {
                const url = await this.cloudinaryService.uploadUseeDealDocument(file, email);
                if (url) return url;
            } catch (error) {
                console.error(`Upload attempt ${i + 1} failed for ${file.filename}:`, error);
            }
        }
        throw new Error(`Failed to upload ${file.filename} after ${attempts} attempts.`);
    }
}
