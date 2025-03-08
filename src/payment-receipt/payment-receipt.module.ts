import { forwardRef, Module } from '@nestjs/common';
import { PaymentReceiptController } from './payment-receipt.controller';
import { PaymentReceiptService } from './payment-receipt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import PaymentReceipt from './payment-receipt.entity';
import { Deal } from '../deal/deal.entity';


@Module({
  imports: [TypeOrmModule.forFeature([InvitationTracker, Deal, PaymentReceipt])],
  controllers: [PaymentReceiptController],
  providers: [PaymentReceiptService]
})
export class PaymentReceiptModule { }
