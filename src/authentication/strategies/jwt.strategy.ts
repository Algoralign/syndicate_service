import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import User from '../../user/user.entity';
import { JsonResponse, JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,


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
      relations: ['address'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }


    user.password = undefined;

    // Construct the response
    const response: JsonResponse = {
      error: false,
      message: 'User details retrieved successfully',
      status_code: HttpStatus.OK,
      data: {
        user,         // Include the original user object      // Include the extracted roles array
        kyc_detail: {
        }
      }
    };


    // Return the new response
    return response;

  }
}
