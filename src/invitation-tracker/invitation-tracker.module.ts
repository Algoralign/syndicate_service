import { Module } from '@nestjs/common';
import { InvitationTrackerController } from './invitation-tracker.controller';
import { InvitationTrackerService } from './invitation-tracker.service';
import { InvitationTracker } from './invitation-tracker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationTracker])],
  controllers: [InvitationTrackerController],
  providers: [InvitationTrackerService]
})
export class InvitationTrackerModule { }
