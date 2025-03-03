import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { Repository } from 'typeorm';
import AllBank from './interfaces/all-banks.interface';


@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,

  ) { }
  async getBanks(): Promise<AllBank> {
    try {
      return {
        status_code: 200,
        status: true,
        message: 'banks returned successfully',
        data: await this.bankRepository.find(),
      };
    } catch (error) { }
  }

  async retriveBankCountries() {
    try {

      const code = this.bankRepository
        .createQueryBuilder('bank')
        .select(['bank.country_code', 'bank.country_name'])
        .distinct(true)
        .getRawMany();

      return code
    } catch (error) { }
  }

  async retriveBank(code: string) {
    try {
      const banks = this.bankRepository.find({ where: { country_code: code } })
      return banks
    } catch (error) { }
  }
}
