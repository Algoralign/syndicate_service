import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Kyc from '../kyc/kyc.entity';
import { MailService } from '../mail/mail.service';
import { EntityManager, Repository } from 'typeorm';
import ApproveKYCDto from './approve-kyc.dto';
import User from '../user/user.entity';
import PaymentReceipt from '../payment-receipt/payment-receipt.entity';
import RejectPaymentDto from './reject-payment.dto';
import ApprovePaymentDto from './approve-payment.dto';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { Investment, InvestmentStatus } from '../investments/investments.entity';
import { Transaction, TransactionStatus, TransactionType } from '../transaction/transaction.entity';
import { Deal } from '../deal/deal.entity';
import Syndicate from '../syndicate/syndicate.entity';
import { DealService } from '../deal/deal.service';
import EmailVerificationToken from '../email-verification-token/email-verification-token.entity';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(Kyc) private kycRepository: Repository<Kyc>,
        @InjectRepository(EmailVerificationToken) private emailVerificationTokenRepository: Repository<EmailVerificationToken>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(PaymentReceipt) private paymentReceiptRepository: Repository<PaymentReceipt>,
        @InjectRepository(InvitationTracker) private invitationTrackerRepository: Repository<InvitationTracker>,
        @InjectRepository(Investment) private investmentRepository: Repository<Investment>,
        @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
        @InjectRepository(Deal) private dealRepository: Repository<Deal>,
        @InjectRepository(Syndicate) private syndicateRepository: Repository<Syndicate>,
        private mailService: MailService,
        private dealService: DealService

    ) { }


    async getKycs(details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;

            // Using repository's findAndCount instead of query builder
            const [kycs, total] = await this.kycRepository.findAndCount({
                relations: ['user'],
                select: [
                    'id',
                    'first_name',
                    'last_name',
                    'passport',
                    'identityType',
                    'id_image',
                    'address',
                    'address_evidence',
                    'bvn',
                    'swift_bic_code',
                    'account_name',
                    'account_number',
                    'uploaded',
                    'verified',
                    'phone',
                    'failure_reason',
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
                    kycs,
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



    async approveKyc(detail: ApproveKYCDto) {

        try {

            const kycExist = await this.kycRepository.findOne({ where: { id: detail.id }, relations: ['user'] })

            if (kycExist.verified) {
                return {
                    status_code: 400,
                    error: true,
                    message: "kyc already approved",
                };
            }
            if (detail.verified === "true") {

                kycExist.verified = true
                kycExist.rejected = false

                await this.kycRepository.save(kycExist)

                // send email 
                const data = {
                    receiver: kycExist.user.email,
                    syndicate_lead_name: kycExist.user.first_name + " " + kycExist.user.last_name,
                    dashboard_link: `${process.env.ROOT_URL}`,
                }

                await this.mailService.sendKycSuccessEmail(data);
                return {
                    status_code: 200,
                    error: false,
                    message: "kyc status updated succesfully",
                };

            } else {  //

                const data = {
                    receiver: kycExist.user.email,
                    syndicate_lead_name: kycExist.user.first_name + " " + kycExist.user.last_name,
                    retry_kyc_link: `${process.env.ROOT_URL}`,
                    failure_reason: detail.failed_reason
                }

                kycExist.rejected = true
                kycExist.failure_reason = detail.failed_reason
                await this.kycRepository.save(kycExist)

                await this.mailService.sendKycFailEmail(data);
                return {
                    status_code: 200,
                    error: false,
                    message: "kyc status updated succesfully",
                };
            }
        } catch (error) {
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: 'error approving kyc',
            });
        }

    }






    async getUsers(details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;

            // Using repository's findAndCount instead of query builder
            const [kycs, total] = await this.userRepository.findAndCount({
                // relations: ['user'],
                select: [
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'phone',
                    'verified',
                    'user_type',
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
                    kycs,
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


    async getPayments(details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;

            // Using repository's findAndCount instead of query builder
            const [receipts, total] = await this.paymentReceiptRepository.findAndCount({
                relations: ['deal', 'syndicate', 'user', 'system_receiving_account'],
                select: [
                    'id',
                    'recipt_img',
                    'approved',
                    'rejected',
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
                    receipts,
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




    async approvePayment(detail: ApprovePaymentDto) {
        try {

            const receiptExist = await this.paymentReceiptRepository.findOne({
                where: { id: detail.receipt_id },
                relations: ['deal', 'syndicate', 'user', 'system_receiving_account'],
            })

            if (!receiptExist) {
                return {
                    status_code: 400,
                    error: true,
                    message: "payment with id do not exist",
                };
            }

            if (receiptExist.approved) {
                return {
                    status_code: 400,
                    error: true,
                    message: "payment receipt already approved",
                };
            }

            // update the invitation_tracker
            const inviteExist = await this.invitationTrackerRepository.findOne({
                where: {
                    email: receiptExist.user.email,
                    syndicate: { id: receiptExist.syndicate.id },
                    deal: { id: receiptExist.deal.id },
                },
            });

            // get the user
            const userExist = await this.userRepository.findOne({ where: { email: receiptExist.user.email, } })
            if (!receiptExist) {
                return {
                    status_code: 400,
                    error: true,
                    message: "user do not exist on system",
                };
            }


            // get the deal
            const dealExist = await this.dealRepository.findOne({ where: { id: receiptExist.deal.id } })
            if (!dealExist) {
                return {
                    status_code: 400,
                    error: true,
                    message: "deal do not exist",
                };
            }

            // get the deal
            const syndicateExist = await this.syndicateRepository.findOne({ where: { id: receiptExist.syndicate.id } })
            if (!syndicateExist) {
                return {
                    status_code: 400,
                    error: true,
                    message: "syndicate do not exist",
                };
            }

            if (detail.investment_amount && isNaN(Number(detail.investment_amount))) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'investment amount must be a valid number',
                };
            }

            //calculate the investment fee
            let fee = this.dealService.calculateFee((dealExist.percentage_fee ?? 0), (detail?.investment_amount ?? 0));


            const entityManager = this.investmentRepository.manager;
            return await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {

                // create investment
                const createdInvest = this.investmentRepository.create({
                    user: { id: receiptExist.user.id },
                    deal: { id: receiptExist.deal.id },
                    syndicate: { id: receiptExist.syndicate.id },
                    investment_amount: (detail.investment_amount - fee),
                    proposed_amount: inviteExist.proposed_amount,
                    investment_status: InvestmentStatus.APPROVED,
                    currency: inviteExist.currency,
                    is_active: true,
                    payment_receipt: receiptExist,
                    investment_fee: fee
                })
                await transactionalEntityManager.save(Investment, createdInvest);

                // update invite
                inviteExist.user_invested_in_deal = true;
                inviteExist.user_accepted_invite = true;
                inviteExist.actual_amount_invested = (detail.investment_amount - fee);
                inviteExist.investment_fee_on_actual_amount_invested = fee;

                await transactionalEntityManager.save(InvitationTracker, inviteExist);

                // update payment receipt
                receiptExist.approved = true;
                receiptExist.rejected = false;
                receiptExist.investment = createdInvest;
                await transactionalEntityManager.save(PaymentReceipt, receiptExist);

                // create transaction for the payment
                const createdTransaction = this.transactionRepository.create({
                    user: userExist,
                    deal: dealExist,
                    syndicate: syndicateExist,
                    currency: inviteExist.currency,
                    amount: detail.investment_amount,
                    status: TransactionStatus.COMPLETED,
                    type: TransactionType.INVESTMENT,
                    receipt_url: receiptExist.recipt_img,
                    payment_gateway: "Bank Transfer/Deposit"
                })
                await transactionalEntityManager.save(Transaction, createdTransaction);

                return {
                    status_code: 200,
                    error: false,
                    message: "payment received and updated succesfully",
                };
            })

            // create investment
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: error.message,
            });
        }
    }


    async rejectPayment(detail: RejectPaymentDto) {
        try {


            const entityManager = this.paymentReceiptRepository.manager;
            return await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {

                const receiptExist = await this.paymentReceiptRepository.findOne({
                    where: { id: detail.receipt_id }
                })

                if (!receiptExist) {
                    return {
                        status_code: 400,
                        error: true,
                        message: "payment with id do not exist",

                    };
                }

                if (receiptExist.approved) {
                    return {
                        status_code: 400,
                        error: true,
                        message: "payment receipt already approved",
                    };
                }


                // get the user
                const userExist = await this.userRepository.findOne({ where: { email: receiptExist.user.email, } })
                if (!receiptExist) {
                    return {
                        status_code: 400,
                        error: true,
                        message: "user do not exist on system",
                    };
                }

                // get the deal
                const dealExist = await this.dealRepository.findOne({ where: { id: receiptExist.deal.id } })
                if (!dealExist) {
                    return {
                        status_code: 400,
                        error: true,
                        message: "deal do not exist",
                    };
                }

                // get the deal
                const syndicateExist = await this.syndicateRepository.findOne({ where: { id: receiptExist.syndicate.id } })
                if (!syndicateExist) {
                    return {
                        status_code: 400,
                        error: true,
                        message: "syndicate do not exist",
                    };
                }

                receiptExist.reject_reason = detail.reason
                receiptExist.rejected = true
                await transactionalEntityManager.save(PaymentReceipt, receiptExist);

                // get the invitation tracker
                const inviteExist = await this.invitationTrackerRepository.findOne({
                    where: {
                        email: receiptExist.user.email,
                        syndicate: { id: receiptExist.syndicate.id },
                        deal: { id: receiptExist.deal.id },
                    },
                });

                if (!inviteExist) {
                    return {
                        status_code: 400,
                        error: true,
                        message: "invitation do not exist on system",
                    };
                }

                // create transaction for the payment
                const createdTransaction = this.transactionRepository.create({
                    user: userExist,
                    deal: dealExist,
                    syndicate: syndicateExist,
                    currency: inviteExist.currency,
                    amount: detail.investment_amount,
                    status: TransactionStatus.FAILED,
                    type: TransactionType.INVESTMENT,
                    receipt_url: receiptExist.recipt_img,
                    payment_gateway: "Bank Transfer/Deposit",
                    notes: detail.reason
                })
                await transactionalEntityManager.save(Transaction, createdTransaction);


                return {
                    status_code: 200,
                    error: false,
                    message: "reject message updated succesfully",
                };
            })
        } catch (error) {
            throw new InternalServerErrorException({
                error: true,
                status_code: 500,
                message: error.message,
            });
        }
    }

}
