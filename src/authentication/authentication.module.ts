import { Global, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/user.entity';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailVerificationTokenService } from '../email-verification-token/email-verification-token.service';
import EmailVerificationToken from '../email-verification-token/email-verification-token.entity';
import Kyc from '../kyc/kyc.entity';
import Country from '../country/country.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ResetPasswordTokenService } from '../reset-password-token/reset-password-token.service';
import ResetPasswordToken from '../reset-password-token/reset-password-token.entity';
import Address from '../address/address.entity';
import { IdentityTypesService } from '../identity-types/identity-types.service';
import IdentityType from '../identity-types/identity-types.entity';
import { Bank } from '../bank/bank.entity';
import { BankService } from '../bank/bank.service';
import { Deal } from '../deal/deal.entity';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { UtilityService } from '../utility/utility.service';
@Global()
@Module({
  imports: [

    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      EmailVerificationToken,
      Country,
      Address,
      ResetPasswordToken,
      IdentityType,
      Bank,
      Kyc,
      Deal,
      InvitationTracker,
    ])
  ],
  providers: [
    AuthenticationService,
    UserService,
    UtilityService,
    EmailVerificationTokenService,
    JwtStrategy,
    CloudinaryService,
    ResetPasswordTokenService,
    IdentityTypesService,
    BankService
  ],
  controllers: [AuthenticationController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthenticationModule { }


// PassportModule.register({ defaultStrategy: 'jwt' }),
