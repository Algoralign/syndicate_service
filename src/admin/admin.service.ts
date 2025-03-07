import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Kyc from 'src/kyc/kyc.entity';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';
import ApproveKYCDto from './approve-kyc.dto';
import User from '../user/user.entity';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(Kyc) private kycRepository: Repository<Kyc>,
        @InjectRepository(User) private userRepository: Repository<User>,
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
            if (detail.verified == "true") {

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

}
