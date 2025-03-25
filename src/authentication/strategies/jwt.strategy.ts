import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import User from '../../user/user.entity';
import { JsonResponse, JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import Kyc from '../../kyc/kyc.entity';
import { InvitationTracker } from '../../invitation-tracker/invitation-tracker.entity';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Kyc) private kycRepository: Repository<Kyc>,
    @InjectRepository(InvitationTracker) private invitationTrackerRepository: Repository<InvitationTracker>,


  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }


  async validate(payload: JwtPayload): Promise<JsonResponse> {
    const { userId } = payload;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['address', 'address.country', 'syndicates'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }


    let kyc = await this.kycRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (kyc) {
      kyc.user = undefined
    }

    user.password = undefined;


    // const userDeals = await this.invitationTrackerRepository
    //   .createQueryBuilder('invitation')
    //   .leftJoinAndSelect('invitation.deal', 'deal')
    //   .leftJoinAndSelect('invitation.syndicate', 'syndicate')
    //   .where('invitation.email = :email', { email: user.email })
    //   .distinctOn(['invitation.deal', 'invitation.syndicate']) // PostgreSQL only
    //   .getMany();


      const userDeals = await this.invitationTrackerRepository
        .createQueryBuilder('invitation')
        .leftJoinAndSelect('invitation.deal', 'deal')
        .leftJoinAndSelect('invitation.syndicate', 'syndicate')
        .leftJoinAndSelect('syndicate.user', 'syndicate_creator') // Include creator details
        .where('invitation.email = :email', { email: user.email })
        .distinctOn(['invitation.deal', 'invitation.syndicate']) // PostgreSQL only
        .getMany();


    // Step 3: Extract syndicates from both sources
    const syndicatesFromUser = user?.syndicates || [];
    const syndicatesFromDeals = userDeals.map(invite => invite.syndicate);

    // Step 4: Merge & Remove Duplicates (based on ID)
    const uniqueSyndicates = [
      ...new Map(
        [...syndicatesFromUser, ...syndicatesFromDeals].map(syndicate => [syndicate.id, syndicate])
      ).values()
    ];

    // Step 5: Use uniqueSyndicates as needed
    console.log(uniqueSyndicates);

    // Sort the syndicates by `created_at` in ascending order
    const sortedSyndicates = uniqueSyndicates.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    // Get oldest and newest syndicates
    const oldest_syndicate = sortedSyndicates.length > 0 ? sortedSyndicates[0] : null;
    // const newest_syndicate = sortedSyndicates.length > 0 ? sortedSyndicates[sortedSyndicates.length - 1] : null;

    // Construct the response
    const response: JsonResponse = {
      error: false,
      message: 'User details retrieved successfully',
      status_code: HttpStatus.OK,
      data: {
        user,         // Include the original user object      // Include the extracted roles array
        kyc_detail: kyc || {},
        invitations: userDeals,
        all_syndicate: uniqueSyndicates,
        oldest_syndicate,
      }
    };


    // Return the new response
    return response;

  }
}
