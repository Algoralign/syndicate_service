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

    // const userDeals = await this.invitationTrackerRepository.find({
    //   where: { email: user.email },
    //   relations: ['deal', 'syndicate'],
    // });

    const userDeals = await this.invitationTrackerRepository
      .createQueryBuilder('invitation')
      .leftJoinAndSelect('invitation.syndicate', 'syndicate')
      .where('invitation.email = :email', { email: user.email })
      .distinctOn(['invitation.syndicate']) // PostgreSQL only
      .getMany();



    console.log("The user deal", userDeals)
    // Construct the response
    const response: JsonResponse = {
      error: false,
      message: 'User details retrieved successfully',
      status_code: HttpStatus.OK,
      data: {
        user,         // Include the original user object      // Include the extracted roles array
        kyc_detail: kyc || {},
        invited_syndicates: userDeals,
      }
    };


    // Return the new response
    return response;

  }
}
