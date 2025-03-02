import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Country from '../country/country.entity';


import { countryData } from '../_data/countries';

import { anchorBanks } from "../_data/anchor_bank"


import { Cron, Interval } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';




@Injectable()
export class SeedersService {
  private readonly logger = new Logger(SeedersService.name);
  constructor(

    @InjectRepository(Country) private countryRepository: Repository<Country>,


  ) { }


  async createCountry() {
    try {
      for (let i = 0; i < countryData.length; i++) {
        await this.countryRepository.save({
          name: countryData[i].name,
          continent: countryData[i].continent,
          dial_code: countryData[i].dial_code,
          value: countryData[i].value,
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
