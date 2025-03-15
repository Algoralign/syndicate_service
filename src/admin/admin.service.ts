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

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(Kyc) private kycRepository: Repository<Kyc>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(PaymentReceipt) private paymentReceiptRepository: Repository<PaymentReceipt>,
        @InjectRepository(InvitationTracker) private invitationTrackerRepository: Repository<InvitationTracker>,
        @InjectRepository(Investment) private InvestmentRepository: Repository<Investment>,
        private mailService: MailService

    ) { }


    async getKycs(details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;

            // Using repository's findAndCount instead of query builder
            const [kycs, totalCount] = await this.kycRepository.findAndCount({
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
                    totalCount,
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
                status: false,
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
            const [kycs, totalCount] = await this.userRepository.findAndCount({
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
                    totalCount,
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
            const [receipts, totalCount] = await this.paymentReceiptRepository.findAndCount({
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
                    totalCount,
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


    async rejectPayment(detail: RejectPaymentDto) {
        try {
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

            receiptExist.reject_reason = detail.reason
            receiptExist.rejected = true

            await this.paymentReceiptRepository.save(receiptExist)

            return {
                status_code: 200,
                error: false,
                message: "reject message updated succesfully",

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

            const entityManager = this.InvestmentRepository.manager;

            return await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {

                // create investment
                const createdInvest = this.InvestmentRepository.create({
                    user: { id: receiptExist.user.id },
                    deal: { id: receiptExist.deal.id },
                    syndicate: { id: receiptExist.syndicate.id },
                    investment_amount: receiptExist.investment_amount,
                    proposed_amount: inviteExist.proposed_amount,
                    investment_status: InvestmentStatus.APPROVED,
                    currency: inviteExist.currency,
                    is_active: true,
                    payment_receipt: receiptExist

                })
                await transactionalEntityManager.save(Investment, createdInvest);

                // update invite
                inviteExist.funding_amount = receiptExist.investment_amount
                inviteExist.user_invested_in_deal = true
                inviteExist.user_accepted_invite = true
                await transactionalEntityManager.save(InvitationTracker, inviteExist);

                // update payment receipt
                receiptExist.approved = true;
                receiptExist.rejected = false;
                receiptExist.investment = createdInvest;
                await transactionalEntityManager.save(PaymentReceipt, receiptExist);

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

}
