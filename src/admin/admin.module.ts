import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import Kyc from '../kyc/kyc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/user.entity';
import { Investment } from '../investments/investments.entity';
import { Deal } from '../deal/deal.entity';
import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kyc, User, Investment, Deal, InvestmentInstrument])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }
