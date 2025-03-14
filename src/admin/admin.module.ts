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

@Module({
  imports: [TypeOrmModule.forFeature([
    Kyc,
    User,
    Investment,
    Deal,
    InvestmentInstrument,
    InvitationTracker,
    PaymentReceipt
  ])],
  controllers: [AdminController],
  providers: [AdminService, MailService, UtilityService]
})
// export class AdminModule { }

export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes('/admin');
  }
}
