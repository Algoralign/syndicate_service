import { Module } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
  ])],
  providers: [UtilityService]
})
export class UtilityModule { }
