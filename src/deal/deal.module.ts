import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';
import { Deal } from './deal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import Industry from '../industry/industry.entity';
import User from '../user/user.entity';
import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import Country from '../country/country.entity';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { UserService } from '../user/user.service';
import Address from '../address/address.entity';
import { EmailVerificationTokenService } from '../email-verification-token/email-verification-token.service';
import { ResetPasswordTokenService } from '../reset-password-token/reset-password-token.service';
import EmailVerificationToken from '../email-verification-token/email-verification-token.entity';
import ResetPasswordToken from '../reset-password-token/reset-password-token.entity';
import { Investment } from '../investments/investments.entity';
import SystemReceivingAccount from '../system-receiving-account/system-receiving-account.entity';
import Syndicate from '../syndicate/syndicate.entity';
import PaymentReceipt from '../payment-receipt/payment-receipt.entity';
import { BlockAdminMiddleware } from '../middlewares/block-admin.middleware';
import { UtilityService } from '../utility/utility.service';
import { Transaction } from '../transaction/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Deal,
    User,
    Industry,
    InvestmentInstrument,
    Country,
    InvitationTracker,
    Address,
    EmailVerificationToken,
    ResetPasswordToken,
    Investment,
    SystemReceivingAccount,
    Syndicate,
    PaymentReceipt,
    Transaction
  ])],
  controllers: [DealController],
  providers: [DealService, CloudinaryService, UserService, EmailVerificationTokenService, ResetPasswordTokenService, UtilityService]
})
// export class DealModule { }

export class DealModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BlockAdminMiddleware).forRoutes('/deal');
  }
}
