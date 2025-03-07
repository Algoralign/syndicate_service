import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';
import Industry from '../industry/industry.entity';
import { Deal } from './deal.entity';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { UserService } from '../user/user.service';
import { Currency, Investment, InvestmentStatus } from '../investments/investments.entity';
import { UserType } from '../_enums/user-type.enum';
import CreateDealDto from './deal.dto';


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

            if (details.funding_amount && isNaN(Number(details.funding_amount))) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'funding amount must be a valid number',
                };
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
                    funding_amount: details.funding_amount && !isNaN(Number(details.funding_amount))
                        ? Number(details.funding_amount)
                        : 0.00,
                    repayment_schedule_code: details.repayment_schedule_code,
                    disbursement_schedule_code: details.disbursement_schedule_code,
                    spv_code: details.spv_code,
                    spv_name: details.spv_name,
                    currency: details.currency,
                    investors: details.investors,
                    waterfall_distribution_structure: waterfall_distribution_structure_url,
                    angel_waterfall_distribution_structure: angel_waterfall_distribution_structure_url
                });


                const createdDeal = await transactionalEntityManager.save(Deal, deal);


                // add founder to tracker
                const trackFounder = this.invitationTrackerRepository.create({
                    first_name: details.founder_firstname,
                    last_name: details.founder_lastname,
                    email: details.founder_email,
                    currency: details.currency,
                    funding_amount: details.funding_amount ? Number(details.funding_amount) : 0,
                    invited_by: { id: userExist.id },
                    deal: { id: createdDeal.id },
                    user_type: UserType.FOUNDER,
                })
                await transactionalEntityManager.save(InvitationTracker, trackFounder);

                const invitedInv = typeof details.investors === "string" ? JSON.parse(details.investors) : details.investors;


                // Create invitation trackers
                const trackers = invitedInv.map((invitee) =>
                    this.invitationTrackerRepository.create({
                        first_name: invitee.first_name,
                        last_name: invitee.last_name,
                        email: invitee.email,
                        currency: invitee.currency,
                        proposed_amount: invitee.amount,
                        funding_amount: details.funding_amount ? Number(details.funding_amount) : 0,
                        invited_by: { id: userExist.id },
                        deal: { id: createdDeal.id },
                        user_type: UserType.SYNDICATE,
                    })
                );
                await transactionalEntityManager.save(InvitationTracker, trackers);


                return {
                    status_code: 201,
                    error: false,
                    message: 'deals created succesfully',
                    data: createdDeal,
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


    async getCurrency() {
        return {
            status_code: 200,
            error: false,
            data: Object.keys(Currency),
            message: 'data retrieved succesfully',
        };
    }





    async getUserpendingdeal(user, details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;

            // Using repository's findAndCount instead of query builder
            const [deals, totalCount] = await this.invitationTrackerRepository.findAndCount({
                where: { email: user.email },
                relations: ['deal', 'deal.user'],
                select: [
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'user_type',
                    'created_at',
                    'updated_at'
                ],
                order: { created_at: 'DESC' },
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
            });

            // Manually remove the unwanted fields from deal
            const sanitizedDeals = deals.map(deal => {
                if (deal.deal) {
                    delete deal.deal.investors; // Replace with actual field you want to remove
                }
                return deal;
            });

            return {
                status_code: 200,
                error: false,
                message: "data retrieved successfully",
                data: {
                    sanitizedDeals,
                    totalCount,
                },
            };



            // No need for manual sanitization
            // const [deals, totalCount] = await this.invitationTrackerRepository
            // .createQueryBuilder('invitation')
            // .leftJoinAndSelect('invitation.deal', 'deal')
            // .leftJoinAndSelect('deal.user', 'user')
            // .select([
            //     'invitation.id',
            //     'invitation.first_name',
            //     'invitation.last_name',
            //     'invitation.email',
            //     'invitation.user_type',
            //     'invitation.created_at',
            //     'invitation.updated_at',
            //     'deal.id',  // Only selecting deal ID (remove other fields)
            //     'user.id',  // Only selecting user ID (remove other fields)
            // ])
            // .orderBy('invitation.created_at', 'DESC')
            // .skip((pageNumber - 1) * pageSize)
            // .take(pageSize)
            // .getManyAndCount();
        } catch (error) {
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: error.message,
            });
        }
    }



}
