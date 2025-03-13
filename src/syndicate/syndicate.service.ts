import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Syndicate from './syndicate.entity';
import { Repository } from 'typeorm';
import InvestmentInstrument from 'src/investment-instrument/investment-instrument.entity';
import User from '../user/user.entity';
import CreateSyndicateDto from './syndicate.dto';

@Injectable()
export class SyndicateService {


    constructor(
        @InjectRepository(Syndicate) private syndicateRepository: Repository<Syndicate>,
        @InjectRepository(InvestmentInstrument) private investmentInstrumentRepository: Repository<InvestmentInstrument>,
        @InjectRepository(User) private userRepository: Repository<User>,

    ) { }


    async submitDeal(user: any, details: CreateSyndicateDto) {
        try {

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



            if (details.ticket_size && isNaN(Number(details.ticket_size))) {
                return {
                    status_code: 400,
                    error: true,
                    message: 'ticket size must be a valid number',
                };
            }

            const syndicate = this.syndicateRepository.create({
                user: userExist,
                name: details.name,
                ticket_size: details.ticket_size,
                investment_instrument: investmentInstrument,
            })


            const cSyndiacte = await this.syndicateRepository.save(syndicate)

            cSyndiacte.user = null

            return {
                status_code: 200,
                error: false,
                message: "syndicate created successfully",
                data: cSyndiacte
            };


        } catch (error) {
            console.error('KYC Submission Error:', error);
            throw new BadRequestException({ message: "error creating syndicate" });
        }
    }




    async getUserSyndicates(user: User, details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;



            // Using repository's findAndCount instead of query builder
            const [syndicate, totalCount] = await this.syndicateRepository.findAndCount({
                where: { user: { email: user.email } },
                relations: ['user', 'deal', 'investment_instrument'],
                select: [
                    'id',
                    'name',
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
                    syndicate,
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


    async getSyndicateById(id: any) {
        try {
            // Using repository's findAndCount instead of query builder
            const syndicate = await this.syndicateRepository.findOne({
                where: { id: id },
                relations: ['user', 'deal', 'investment_instrument'],
            });

            return {
                status_code: 200,
                error: false,
                message: "data retrieved successfully",
                data: syndicate
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
