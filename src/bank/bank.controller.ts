import { Controller, Get, UseGuards } from '@nestjs/common';
import { BankService } from './bank.service';
import { AuthGuard } from '@nestjs/passport';
import AllBankInterface from './interfaces/all-banks.interface';

@UseGuards(AuthGuard())
@Controller('bank')
export class BankController {
  constructor(private bankService: BankService) { }

  @Get('/')
  async getBanks(): Promise<AllBankInterface> {
    return this.bankService.getBanks();
  }
}
