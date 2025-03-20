import * as fs from 'fs';
import { promisify } from 'util';
import * as path from 'path';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User, { InviteType } from '../user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';
import Industry from '../industry/industry.entity';
import { Deal } from './deal.entity';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { UserService } from '../user/user.service';
import { Investment, InvestmentStatus } from '../investments/investments.entity';
import { UserType } from '../_enums/user-type.enum';
import CreateDealDto from './deal.dto';
import SystemReceivingAccount from '../system-receiving-account/system-receiving-account.entity';
import Syndicate from '../syndicate/syndicate.entity';
import CreatePaymentDto from './payment.dto';
import PaymentReceipt from '../payment-receipt/payment-receipt.entity';
import { Currency } from '../_enums/currency.enum';
import { Transaction } from '../transaction/transaction.entity';


const unlinkAsync = promisify(fs.unlink);

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

        @InjectRepository(SystemReceivingAccount)
        private systemReceivingAccountRepository: Repository<SystemReceivingAccount>,

        @InjectRepository(Deal)
        private dealRepository: Repository<Deal>,

        @InjectRepository(InvitationTracker)
        private invitationTrackerRepository: Repository<InvitationTracker>,

        @InjectRepository(Investment)
        private investmentRepository: Repository<Investment>,


        @InjectRepository(Syndicate)
        private syndicateRepository: Repository<Syndicate>,

        @InjectRepository(PaymentReceipt)
        private paymentReceiptRepository: Repository<PaymentReceipt>,

        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,

    ) { }



    async submitDeal(files: any, user: any, details: any): Promise<any> {

        try {
            if (!files || !files.waterfall_distribution_structure || !files.angel_waterfall_distribution_structure || !files.custom_repayment_schedule_doc || !files.custom_disbursement_schedule_doc) {
                throw new BadRequestException('All files  are required');
            }

            // const userExist = await this.userRepository.findOneBy({ id: user.data.user.id })
            const userExist = await this.userRepository.findOne({
                where: { id: user.data.user.id },
                relations: ['deals', 'syndicates', 'kyc'] // Add other relations if needed
            });


            if (userExist.kyc.verified === false) {
                return {
                    status_code: 401,
                    error: true,
                    message: 'your kyc has not been verified - still going through verification',
                };
            }


            if (!user) {
                throw new BadRequestException('user unauthorized');
            }

            if (details.funding_amount && isNaN(Number(details.funding_amount))) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'funding amount must be a valid amount',
                };
            }


            if (details.ticket_size && isNaN(Number(details.ticket_size))) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'ticket_size  must be a valid amount',
                };
            }


            if (details.investing_amount && isNaN(Number(details.investing_amount))) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'investing amount must be a valid number',
                };
            }

            // check for syndicate 
            const theSyndicate = await this.syndicateRepository.findOne({
                where: { id: details.syndicate_id },
                relations: ['user', 'deals'],  // Ensure 'user' is the correct relation name
            });


            if (!theSyndicate) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'this syndicate with the given id do not exist',
                };
            }



            if (theSyndicate.user.email != userExist.email) {
                return {
                    status_code: 401,
                    error: true,
                    message: 'user can not create a deal in this syndicate - unauthorised',
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



            // Upload files with error handling
            const uploadResults = await Promise.allSettled([
                this.uploadWithRetry(files.waterfall_distribution_structure[0], userExist.email),
                this.uploadWithRetry(files.angel_waterfall_distribution_structure[0], userExist.email),
                this.uploadWithRetry(files.custom_repayment_schedule_doc[0], userExist.email),
                this.uploadWithRetry(files.custom_disbursement_schedule_doc[0], userExist.email)
            ]);

            // Extract results  

            const waterfall_distribution_structure_url = uploadResults[0].status === 'fulfilled' ? uploadResults[0].value : null;
            const angel_waterfall_distribution_structure_url = uploadResults[1].status === 'fulfilled' ? uploadResults[1].value : null;
            const custom_repayment_schedule_doc = uploadResults[1].status === 'fulfilled' ? uploadResults[1].value : null;
            const custom_disbursement_schedule_doc = uploadResults[1].status === 'fulfilled' ? uploadResults[1].value : null;

            // Check if any upload failed
            if (!waterfall_distribution_structure_url || !angel_waterfall_distribution_structure_url || !custom_repayment_schedule_doc || !custom_disbursement_schedule_doc) {
                throw new Error('One or more document uploads failed. Please try again.');
            }  //

            const entityManager = this.dealRepository.manager;

            return await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {

                // Save deals details if all uploads are successful
                const deal = this.dealRepository.create({
                    user: userExist,
                    syndicate: theSyndicate,
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
                    waterfall_distribution_structure: waterfall_distribution_structure_url,
                    angel_waterfall_distribution_structure: angel_waterfall_distribution_structure_url,
                    investment_instrument: investmentInstrument,
                    custom_repayment_schedule_doc: custom_repayment_schedule_doc,
                    custom_disbursement_schedule_doc: custom_disbursement_schedule_doc,
                    ticket_size: details.ticket_size && !isNaN(Number(details.ticket_size))
                        ? Number(details.ticket_size)
                        : 0.00,
                });


                const createdDeal = await transactionalEntityManager.save(Deal, deal);

                // // update syndicate
                // theSyndicate.deal = createdDeal
                // await transactionalEntityManager.save(Syndicate, theSyndicate);


                // add founder to tracker
                const trackFounder = this.invitationTrackerRepository.create({
                    first_name: details.founder_firstname,
                    last_name: details.founder_lastname,
                    email: details.founder_email,
                    currency: details.currency,
                    funding_amount: details.funding_amount ? Number(details.funding_amount) : 0,
                    invited_by: { id: userExist.id },
                    deal: { id: createdDeal.id },
                    syndicate: { id: theSyndicate.id },
                    user_type: UserType.FOUNDER,
                    invite_type: InviteType.REFFERRAL
                })
                await transactionalEntityManager.save(InvitationTracker, trackFounder);

                // Create invitation trackers
                const invitedInv = typeof details.investors === "string" ? JSON.parse(details.investors) : details.investors;
                const trackers = invitedInv.map((invitee) => {
                    // calculate the investment fee for proposed amount

                    let fee = (((theSyndicate?.percentage_fee ?? 0) / 100) * (invitee?.amount ?? 0));

                    return this.invitationTrackerRepository.create({
                        first_name: invitee.first_name,
                        last_name: invitee.last_name,
                        email: invitee.email,
                        currency: invitee.currency,
                        proposed_amount: invitee.amount,
                        funding_amount: details.funding_amount ? Number(details.funding_amount) : 0,
                        invited_by: { id: userExist.id },
                        deal: { id: createdDeal.id },
                        syndicate: { id: theSyndicate.id },
                        user_type: UserType.SYNDICATE_INVESTOR,
                        invite_type: InviteType.REFFERRAL,
                        investment_fee: fee
                    })
                }
                );
                await transactionalEntityManager.save(InvitationTracker, trackers);


                //invite self to deal
                let fee = (((theSyndicate?.percentage_fee ?? 0) / 100) * (details?.investing_amount ?? 0));
                const selfInvite = this.invitationTrackerRepository.create({
                    first_name: userExist.first_name,
                    last_name: userExist.last_name,
                    email: userExist.email,
                    currency: details.currency,
                    proposed_amount: details.investing_amount ? Number(details.funding_amount) : 0.00,
                    funding_amount: details.funding_amount ? Number(details.funding_amount) : 0.00,
                    invited_by: { id: userExist.id },
                    deal: { id: createdDeal.id },
                    syndicate: { id: theSyndicate.id },
                    user_type: UserType.SYNDICATE_LEAD,
                    invite_type: InviteType.SELF,
                    investment_fee: fee,
                    email_sent: true,
                    logged_in: true,
                })

                await transactionalEntityManager.save(InvitationTracker, selfInvite);

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


    async uploadPayment(files: any, user: User, details: CreatePaymentDto): Promise<any> {
        try {

            if (!files || !files.receipt_img) {
                throw new BadRequestException('payment receipt is required');
            }


            if (details.investment_amount && isNaN(Number(details.investment_amount))) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'investment amount must be a valid number',
                };
            }

            const userExist = await this.userRepository.findOneBy({ id: user.id })
            if (!userExist) {
                throw new BadRequestException('user unauthorized');
            }


            const systemBankExist = await this.systemReceivingAccountRepository.findOneBy({ id: details.system_receiving_account_id })
            if (!systemBankExist) {
                throw new BadRequestException('bank selected do not exist');
            }

            // check syndicate exist
            const syndicateExist = await this.syndicateRepository.findOne({ where: { id: details.syndicate_id }, relations: ['deals'], })
            if (!syndicateExist) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'syndicate do not exist',
                };
            }


            // Extract the deal from the array in syndicate
            const retrieve_deal = syndicateExist.deals.find(deal => deal.id === details.deal_id);

            if (!retrieve_deal) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'Deal does not exist within this syndicate',
                };
            }
            const dealExist = await this.dealRepository.findOne({ where: { id: retrieve_deal.id } })
            if (!dealExist) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'deal do not exist',
                };
            }

            // check invite if this syndicate invited this user 
            const inviteExist = await this.invitationTrackerRepository.findOne({
                where: {
                    email: user.email,
                    id: details.invite_id,
                    syndicate: { id: syndicateExist.id }, // This works in TypeORM v0.3+
                },
            });
            if (!inviteExist) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'invalid invite or syndicate supplied',
                };
            }



            // Upload files with error handling
            const uploadResults = await Promise.allSettled([
                this.uploadWithRetryPaymentUpload(files.receipt_img[0], inviteExist.email),
            ]);


            // Extract results  
            const receipt_img_url = uploadResults[0].status === 'fulfilled' ? uploadResults[0].value : null;


            // Check if any upload failed
            if (!receipt_img_url) {
                throw new Error('One or more document uploads failed. Please try again.');
            }

            const entityManager = this.paymentReceiptRepository.manager;

            return await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {

                // create payment 
                const payment = this.paymentReceiptRepository.create({
                    recipt_img: receipt_img_url,
                    user: userExist,
                    deal: dealExist,
                    syndicate: syndicateExist,
                    system_receiving_account: systemBankExist,
                    invitation_tracker: inviteExist,
                    investment_amount: details.investment_amount ? Number(details.investment_amount) : 0.00,
                });


                await transactionalEntityManager.save(PaymentReceipt, payment);

                // updaate inviation 
                inviteExist.receipt_uploaded = true
                inviteExist.logged_in = true
                await transactionalEntityManager.save(InvitationTracker, inviteExist);

                return {
                    status_code: 200,
                    error: false,
                    message: 'payments uploaded succesfully',
                };

            })
        } catch (error) {
            console.error('Payment Submission Error:', error);
            throw new BadRequestException({ message: error.message });
        }
    }

    async uploadWithRetry(file: any, email: string, attempts = 3): Promise<string> {
        let storagePath: string = path.join(path.resolve('./'), `uploads/deals-document/${file.filename}`);

        for (let i = 0; i < attempts; i++) {
            try {
                const url = await this.cloudinaryService.uploadUseeDealDocument(file, email);
                if (url) {
                    // Delete the file after successful upload
                    await unlinkAsync(storagePath);
                    console.log(`Deleted local file after successful upload: ${storagePath}`);
                    return url;
                }
            } catch (error) {
                console.error(`Upload attempt ${i + 1} failed for ${file.filename}:`, error);
            }
        }

        // Delete file from local storage after all attempts fail
        try {
            await unlinkAsync(storagePath);
            console.log(`Deleted local file after failed upload: ${storagePath}`);
        } catch (deleteError) {
            console.error(`Failed to delete file after unsuccessful upload: ${storagePath}`, deleteError);
        }

        throw new Error(`Failed to upload ${file.filename} after ${attempts} attempts.`);
    }



    async uploadWithRetryPaymentUpload(file: any, email: string, attempts = 3): Promise<string> {
        let storagePath: string = path.join(path.resolve('./'), `uploads/payment-document/${file.filename}`);


        for (let i = 0; i < attempts; i++) {
            try {
                const url = await this.cloudinaryService.uploadUseePaymentDocument(file, email);
                if (url) {
                    // Delete the file after successful upload
                    await unlinkAsync(storagePath);
                    console.log(`Deleted local file after successful upload: ${storagePath}`);
                    return url;
                }
            } catch (error) {
                console.error(`Upload attempt ${i + 1} failed for ${file.filename}:`, error);
            }
        }

        // Delete file from local storage after all attempts fail
        try {
            await unlinkAsync(storagePath);
            console.log(`Deleted local file after failed upload: ${storagePath}`);
        } catch (deleteError) {
            console.error(`Failed to delete file after unsuccessful upload: ${storagePath}`, deleteError);
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

    async getSystemBank() {
        try {

            const data = await this.systemReceivingAccountRepository.find()
            return {
                status_code: 200,
                error: false,
                message: "data retrieved successfully",
                data: data
            };
        } catch (error) {
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: error.message,
            });
        }
    }



    async getUserPendingDeal(user: User, details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;



            // Using repository's findAndCount instead of query builder
            const [deals, total] = await this.invitationTrackerRepository.findAndCount({
                where: { email: user.email },
                relations: ['deal', 'deal.startup_industry', 'syndicate', 'invited_by'],
                select: [
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'proposed_amount',
                    'funding_amount',
                    'currency',
                    'email_sent',
                    'user_type',
                    'user_invested_in_deal',
                    'user_accepted_invite',
                    'invite_type',
                    'created_at',
                    'updated_at'
                ],
                order: { created_at: 'DESC' },
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
            });

            // Manually remove the unwanted fields from deal
            const pendingdeals = deals.map(deal => {
                if (deal.invited_by) {
                    delete deal.invited_by.password; // Replace with actual field you want to remove
                    // delete deal.deal.investors;
                }
                return deal;
            });

            return {
                status_code: 200,
                error: false,
                message: "data retrieved successfully",
                data: {
                    pendingdeals,
                    pagination: {
                        current_page: pageNumber,
                        page_size: pageSize,
                        totalCount: total,
                        total_pages: Math.ceil(total / pageSize),
                    },
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




    async getUserOnboardedDeals(user: User, details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;



            // Using repository's findAndCount instead of query builder
            const [deals, total] = await this.invitationTrackerRepository.findAndCount({
                where: { email: user.email, user_invested_in_deal: true },
                relations: ['deal', 'deal.startup_industry', 'syndicate', 'invited_by'],
                select: [
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'proposed_amount',
                    'funding_amount',
                    'currency',
                    'email_sent',
                    'user_type',
                    'user_invested_in_deal',
                    'user_accepted_invite',
                    'invite_type',
                    'created_at',
                    'updated_at'
                ],
                order: { created_at: 'DESC' },
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
            });

            // Manually remove the unwanted fields from deal
            const onboardeddeals = deals.map(deal => {
                if (deal.invited_by) {
                    delete deal.invited_by.password; // Replace with actual field you want to remove
                    // delete deal.deal.investors;
                }
                return deal;
            });

            return {
                status_code: 200,
                error: false,
                message: "data retrieved successfully",
                data: {
                    onboardeddeals,
                    pagination: {
                        current_page: pageNumber,
                        page_size: pageSize,
                        totalCount: total,
                        total_pages: Math.ceil(total / pageSize),
                    },
                },
            };


        } catch (error) {
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: error.message,
            });
        }
    }
    async getCreatedDeals(user: User, details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;



            // Using repository's findAndCount instead of query builder
            const [createddeals, total] = await this.dealRepository.findAndCount({
                where: { user: { id: user.id } },
                relations: ['startup_industry', 'investments', 'invitations'],
                select: [
                    'id',
                    'startup_name',
                    'founder_firstname',
                    'founder_lastname',
                    'founder_email',
                    'startup_website',
                    'funding_amount',
                    'repayment_schedule_code',
                    'disbursement_schedule_code',
                    'spv_code',
                    'spv_name',
                    'waterfall_distribution_structure',
                    'angel_waterfall_distribution_structure',
                    'verified',
                    'currency',
                    'created_at',
                    'updated_at'
                ],
                order: { created_at: 'DESC' },
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
            });

            // Manually remove the unwanted fields from deal
            // const pendingdeals = deals.map(deal => {
            //     if (deal.invited_by) {
            //         delete deal.invited_by.password; // Replace with actual field you want to remove
            //         delete deal.deal.investors;
            //     }
            //     return deal;
            // });

            return {
                status_code: 200,
                error: false,
                message: "data retrieved successfully",
                data: {
                    createddeals,
                    pagination: {
                        current_page: pageNumber,
                        page_size: pageSize,
                        totalCount: total,
                        total_pages: Math.ceil(total / pageSize),
                    },
                },
            };


        } catch (error) {
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: error.message,
            });
        }
    }
    async getDealTransaction(user: User, details: any) {
        try {
            let { page_size, page_number, deal_id, syndicate_id } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;



            // check the deal 
            const inviteExist = await this.invitationTrackerRepository.findOne({
                where: {
                    deal: { id: deal_id },
                    user: { id: user.id }
                }
            });

            if (!inviteExist) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'invite do not exist for user to fetch transactions for the deal',
                };
            }

            if (inviteExist.user_type == UserType.SYNDICATE_INVESTOR) {

                // Using repository's findAndCount instead of query builder
                const [transactions, total] = await this.transactionRepository.findAndCount({
                    where: { deal: { id: deal_id }, syndicate: { id: syndicate_id }, user: { id: user.id } },
                    select: [
                        'id',
                        'amount',
                        'status',
                        'receipt_url',
                        'payment_gateway',
                        'type',
                        'currency',
                        'created_at',
                        'updated_at'
                    ],
                    order: { created_at: 'DESC' },
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                });

                return {
                    status_code: 200,
                    error: false,
                    message: "data retrieved successfully",
                    data: {
                        transactions,
                        pagination: {
                            current_page: pageNumber,
                            page_size: pageSize,
                            totalCount: total,
                            total_pages: Math.ceil(total / pageSize),
                        },
                    },
                };
            } else {
                // Using repository's findAndCount instead of query builder
                const [transactions, total] = await this.transactionRepository.findAndCount({
                    where: { deal: { id: deal_id }, syndicate: { id: syndicate_id } },
                    select: [
                        'id',
                        'amount',
                        'status',
                        'receipt_url',
                        'payment_gateway',
                        'type',
                        'currency',
                        'created_at',
                        'updated_at'
                    ],
                    order: { created_at: 'DESC' },
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                });

                return {
                    status_code: 200,
                    error: false,
                    message: "data retrieved successfully",
                    data: {
                        transactions,
                        pagination: {
                            current_page: pageNumber,
                            page_size: pageSize,
                            totalCount: total,
                            total_pages: Math.ceil(total / pageSize),
                        },
                    },
                };
            }



            // Manually remove the unwanted fields from deal
            // const pendingdeals = deals.map(deal => {
            //     if (deal.invited_by) {
            //         delete deal.invited_by.password; // Replace with actual field you want to remove
            //         delete deal.deal.investors;
            //     }
            //     return deal;
            // });




        } catch (error) {
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: error.message,
            });
        }
    }

    async getDealInvites(user: User, details: any) {
        try {
            let { page_size, page_number, deal_id, syndicate_id } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;

            const [createddeals, total] = await this.invitationTrackerRepository
                .createQueryBuilder('invitation')
                .leftJoinAndSelect('invitation.user', 'user')
                .leftJoin('user.kyc', 'kyc') // Join without selecting all fields
                .select([
                    'invitation.id',
                    'invitation.first_name',
                    'invitation.last_name',
                    'invitation.email',
                    'invitation.actual_amount_invested',
                    'invitation.proposed_amount',
                    'invitation.funding_amount',
                    'invitation.user_type',
                    'invitation.logged_in',
                    'invitation.user_invested_in_deal',
                    'invitation.user_accepted_invite',
                    'invitation.invite_type',
                    'invitation.receipt_uploaded',
                    'invitation.created_at',
                    'invitation.updated_at',
                    'user.id',  // Ensure user relation is included
                    'user.first_name',
                    'user.last_name',
                    'user.email',
                    'user.verified',
                    'kyc.id',
                    'kyc.verified',
                    'kyc.rejected',
                    'kyc.uploaded',

                ])
                .where('invitation.deal = :dealId', { dealId: deal_id })
                .andWhere('invitation.syndicate = :syndicateId', { syndicateId: syndicate_id })
                .orderBy('invitation.created_at', 'DESC')
                .skip((pageNumber - 1) * pageSize)
                .take(pageSize)
                .getManyAndCount();

            return {
                status_code: 200,
                error: false,
                message: 'Data retrieved successfully',
                data: {
                    createddeals,
                    pagination: {
                        current_page: pageNumber,
                        page_size: pageSize,
                        totalCount: total,
                        total_pages: Math.ceil(total / pageSize),
                    },
                },
            };


        } catch (error) {
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: error.message,
            });
        }
    }



    async getCreatedSyndicates(user: User, details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;



            // Using repository's findAndCount instead of query builder
            const [createddeals, total] = await this.syndicateRepository.findAndCount({
                where: { user: { id: user.id } },
                relations: ['deals', 'deals.user'],
                select: [
                    'id',
                    'name',
                    'ticket_size',
                    'created_at',
                    'updated_at'
                ],
                order: { created_at: 'DESC' },
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
            });


            return {
                status_code: 200,
                error: false,
                message: "data retrieved successfully",
                data: {
                    createddeals,
                    pagination: {
                        current_page: pageNumber,
                        page_size: pageSize,
                        totalCount: total,
                        total_pages: Math.ceil(total / pageSize),
                    },
                },
            };


        } catch (error) {
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: error.message,
            });
        }
    }



    async getDealById(details: any, user: User) {
        try {
            let { deal_id, syndicate_id } = details;
            // Using repository's findAndCount instead of query builder
            const deal = await this.dealRepository.findOne({
                where: { id: deal_id, syndicate: { id: syndicate_id } },
                relations: ['startup_industry', 'syndicate'],
            });

            const investment = await this.investmentRepository.findOne({ where: { deal: { id: deal.id }, user: { id: user.id } }, relations: ['deal', 'user'] })

            // get the user invitation 
            const userInvitation = await this.invitationTrackerRepository.findOne({ where: { email: user.email } })

            // get total deposited
            const totalDeposited = await this.investmentRepository
                .createQueryBuilder("investment")
                .select("COALESCE(SUM(investment.investment_amount), 0)", "total")
                .where("investment.investment_status = :status", { status: InvestmentStatus.APPROVED })
                .andWhere("investment.is_active = :isActive", { isActive: true })
                .andWhere("investment.dealId = :dealId", { dealId: deal_id })  // Ensure `deal_id` is passed correctly
                .andWhere("investment.syndicateId = :syndicateId", { syndicateId: syndicate_id }) // Ensure `syndicate_id` is passed correctly
                .getRawOne();

            console.log("Total Deposited:", totalDeposited.total);


            return {
                status_code: 200,
                error: false,
                message: "data retrieved successfully",
                data: {
                    deal: deal,
                    user_invested: investment ? true : false,
                    invite_detail: userInvitation,
                    total_deposited: totalDeposited?.total,
                    total_disbursed: 0.00
                }
            };
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: error.message,
            });
        }
    }


}
