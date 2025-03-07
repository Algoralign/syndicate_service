import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Kyc from 'src/kyc/kyc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(Kyc) private kycRepository: Repository<Kyc>,

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



    async approveKyc(id: string, verify: string) {

        try {
            if (verify == "true") {
                //
                console.log("nice")
                const kycExist = await this.kycRepository.findOne({ where: { id: id } })
                kycExist.verified = true
                await this.kycRepository.save(kycExist)

                // send email 
                return {
                    status_code: 200,
                    error: false,
                    message: "kyc status updated succesfully",
                };
            }

            console.log("not nice")
            return {
                status_code: 200,
                error: false,
                message: "kyc status updated succesfully",
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: false,
                status_code: 500,
                message: 'error approving kyc',
            });
        }

    }
}
