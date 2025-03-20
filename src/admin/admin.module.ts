import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import Kyc from '../kyc/kyc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/user.entity';
import { Investment } from '../investments/investments.entity';
import { Deal } from '../deal/deal.entity';
import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';
import { MailService } from '../mail/mail.service';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import PaymentReceipt from '../payment-receipt/payment-receipt.entity';
import { AdminMiddleware } from '../middlewares/admin.middleware';
import { UtilityService } from '../utility/utility.service';
import { Transaction } from '../transaction/transaction.entity';
import Syndicate from '../syndicate/syndicate.entity';
import { DealService } from '../deal/deal.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserService } from '../user/user.service';
import Industry from '../industry/industry.entity';
import SystemReceivingAccount from '../system-receiving-account/system-receiving-account.entity';
import Country from '../country/country.entity';
import Address from '../address/address.entity';
import { EmailVerificationTokenService } from '../email-verification-token/email-verification-token.service';
import { ResetPasswordTokenService } from '../reset-password-token/reset-password-token.service';
import EmailVerificationToken from '../email-verification-token/email-verification-token.entity';
import ResetPasswordToken from '../reset-password-token/reset-password-token.entity';


@Module({
  imports: [TypeOrmModule.forFeature([
    Kyc,
    User,
    Investment,
    Deal,
    InvestmentInstrument,
    InvitationTracker,
    PaymentReceipt,
    Transaction,
    Syndicate,
    Industry,
    SystemReceivingAccount,
    Country,
    Address,
    EmailVerificationToken,
    ResetPasswordToken

  ])],
  controllers: [AdminController],
  providers: [
    AdminService, 
    MailService, 
    UtilityService, 
    DealService, 
    CloudinaryService, 
    UserService, 
    EmailVerificationTokenService,
    ResetPasswordTokenService,
    

  ]
})
// export class AdminModule { }

export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes('/admin');
  }
}
