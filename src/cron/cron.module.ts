import { Module } from '@nestjs/common';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import User from '../user/user.entity';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from '../deal/deal.entity';
import { Investment } from '../investments/investments.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      InvitationTracker,
      Deal,
      Investment
    ]),
  ],
  controllers: [CronController],
  providers: [CronService, MailService]
})
export class CronModule { }
