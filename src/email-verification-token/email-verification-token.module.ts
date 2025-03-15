import { Module } from '@nestjs/common';
import { EmailVerificationTokenController } from './email-verification-token.controller';
import { EmailVerificationTokenService } from './email-verification-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import EmailVerificationToken from './email-verification-token.entity';
import User from "../user/user.entity";
import { UtilityService } from '../utility/utility.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerificationToken, User])],
  controllers: [EmailVerificationTokenController],
  providers: [EmailVerificationTokenService, UtilityService]
})
export class EmailVerificationTokenModule { }
