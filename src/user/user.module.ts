import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import Country from '../country/country.entity';
import { EmailVerificationTokenService } from '../email-verification-token/email-verification-token.service';
import { ResetPasswordTokenService } from '../reset-password-token/reset-password-token.service';
import EmailVerificationToken from '../email-verification-token/email-verification-token.entity';
import { Utility } from '../utilities/utility';
import ResetPasswordToken from '../reset-password-token/reset-password-token.entity';
import Address from '../address/address.entity';
import { InvitationTracker } from 'src/invitation-tracker/invitation-tracker.entity';

// module
@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Country,
    EmailVerificationToken,
    ResetPasswordToken,
    Address,
    InvitationTracker

  ])],
  controllers: [UserController],
  providers: [UserService, EmailVerificationTokenService, ResetPasswordTokenService, Utility]
})
export class UserModule { }
