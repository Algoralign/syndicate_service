import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Country from './country.entity';

import { LocationDto } from './dto/country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private countryRepository: Repository<Country>,

  ) { }

  async getCountry(): Promise<LocationDto> {
    try {
      const countries = await this.countryRepository.find();

      return {
        code: 200,
        status: true,
        message: 'countries retrieved succesfully',
        data: countries,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


}
