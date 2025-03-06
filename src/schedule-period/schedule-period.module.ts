import { Module } from '@nestjs/common';
import { SchedulePeriodController } from './schedule-period.controller';
import { SchedulePeriodService } from './schedule-period.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Schedule from './schedule-period.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  controllers: [SchedulePeriodController],
  providers: [SchedulePeriodService]
})
export class SchedulePeriodModule { }
