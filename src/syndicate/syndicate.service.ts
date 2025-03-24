import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Syndicate from './syndicate.entity';
import { Repository } from 'typeorm';
import InvestmentInstrument from 'src/investment-instrument/investment-instrument.entity';
import User from '../user/user.entity';
import CreateSyndicateDto from './syndicate.dto';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { Deal } from '../deal/deal.entity';

@Injectable()
export class SyndicateService {


    constructor(
        @InjectRepository(Syndicate) private syndicateRepository: Repository<Syndicate>,
        @InjectRepository(InvestmentInstrument) private investmentInstrumentRepository: Repository<InvestmentInstrument>,
        @InjectRepository(Deal) private dealRepository: Repository<Deal>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(InvitationTracker) private invitationTrackerRepository: Repository<InvitationTracker>,

    ) { }


    async submitSyndicate(user: any, details: CreateSyndicateDto) {
        try {

            const userExist = await this.userRepository.findOneBy({ id: user.data.user.id })

            if (!user) {
                throw new BadRequestException('user unauthorized');
            }



            let syndicate = this.syndicateRepository.create({
                user: userExist,
                name: details.syndicate_name,
                description: details.syndicate_description,
                syndicate_website: details.syndicate_website,
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




    // async getUserSyndicates(user: User, details: any) {
    //     try {
    //         let { page_size, page_number } = details;

    //         const pageNumber = Number(page_number) || 1;
    //         const pageSize = Number(page_size) || 100;



    //         // Using repository's findAndCount instead of query builder
    //         const [syndicate, totalCount] = await this.syndicateRepository.findAndCount({
    //             where: { user: { email: user.email } },
    //             relations: ['user', 'deal', 'investment_instrument'],
    //             select: [
    //                 'id',
    //                 'name',
    //                 'created_at',
    //                 'updated_at'
    //             ],
    //             order: { created_at: 'DESC' },
    //             skip: (pageNumber - 1) * pageSize,
    //             take: pageSize,
    //         });



    //         return {
    //             status_code: 200,
    //             error: false,
    //             message: "data retrieved successfully",
    //             data: {
    //                 syndicate,
    //                 totalCount,
    //             },
    //         };
    //     } catch (error) {
    //         throw new InternalServerErrorException({
    //             error: true,
    //             status_code: 500,
    //             message: error.message,
    //         });
    //     }
    // }

    async getUserSyndicates(user: User, details: any) {
        try {
            let { page_size, page_number } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;

            // Fetch syndicates directly associated with the user
            const [syndicatesFromUser, totalUserSyndicates] = await this.syndicateRepository.findAndCount({
                where: { user: { email: user.email } },
                relations: ['user', 'deals', 'investment_instrument'],
                select: ['id', 'name', 'created_at', 'updated_at'],
                order: { created_at: 'DESC' },
            });

            // Fetch syndicates from deals where the user was invited
            const userDeals = await this.invitationTrackerRepository
                .createQueryBuilder('invitation')
                .leftJoinAndSelect('invitation.deal', 'deal')
                .leftJoinAndSelect('invitation.syndicate', 'syndicate')
                .where('invitation.email = :email', { email: user.email })
                .distinctOn(['invitation.deal', 'invitation.syndicate']) // PostgreSQL only
                .getMany();

            // Extract syndicates from invitations
            const syndicatesFromDeals = userDeals.map(invite => invite.syndicate);

            // Merge both sources and remove duplicates based on `id`
            const uniqueSyndicates = [
                ...new Map(
                    [...syndicatesFromUser, ...syndicatesFromDeals].map(syndicate => [syndicate.id, syndicate])
                ).values()
            ];

            // Implement pagination on the merged syndicates
            const total = uniqueSyndicates.length;
            const paginatedSyndicates = uniqueSyndicates.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

            return {
                status_code: 200,
                error: false,
                message: "Data retrieved successfully",
                data: {
                    syndicates: paginatedSyndicates,
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

    // async getSyndicateDeals(id: any) {
    //     try {
    //         // Using repository's findAndCount instead of query builder
    //         const syndicate = await this.syndicateRepository.findOne({
    //             where: { id: id },
    //             relations: ['deals', 'investment_instrument'],
    //         });

    //         return {
    //             status_code: 200,
    //             error: false,
    //             message: "data retrieved successfully",
    //             data: syndicate
    //         };
    //     } catch (error) {
    //         throw new InternalServerErrorException({
    //             error: true,
    //             status_code: 500,
    //             message: error.message,
    //         });
    //     }
    // }

    async getSyndicateDeals(details: any) {
        try {
            let { page_size, page_number, syndicate_id } = details;

            const pageNumber = Number(page_number) || 1;
            const pageSize = Number(page_size) || 100;

            // Fetch syndicate with basic details
            const syndicate = await this.syndicateRepository.findOne({
                where: { id: syndicate_id },
                relations: ['investment_instrument'],
            });

            if (!syndicate) {
                return {
                    status_code: 404,
                    error: true,
                    message: "Syndicate not found",
                };
            }

            // Fetch paginated deals for this syndicate
            const [deals, total] = await this.dealRepository.findAndCount({
                where: { syndicate: { id: syndicate_id } },
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
                order: { created_at: 'DESC' },
            });

            return {
                status_code: 200,
                error: false,
                message: "Data retrieved successfully",
                data: {
                    syndicate,
                    deals,
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






}
