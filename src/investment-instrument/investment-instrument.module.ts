import { Module } from '@nestjs/common';
import { InvestmentInstrumentController } from './investment-instrument.controller';
import { InvestmentInstrumentService } from './investment-instrument.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import InvestmentInstrument from './investment-instrument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentInstrument])],
  controllers: [InvestmentInstrumentController],
  providers: [InvestmentInstrumentService]
})
export class InvestmentInstrumentModule { }
