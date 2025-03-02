import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { CountryService } from './country.service';

import { LocationDto } from './dto/country.dto';

@Controller('country')
export class CountryController {
  constructor(private countryService: CountryService) { }

  @Get('/all')
  async getCountry(): Promise<LocationDto> {
    return await this.countryService.getCountry();
  }
}
