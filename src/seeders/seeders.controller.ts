import { Controller, Get } from '@nestjs/common';
import { SeedersService } from './seeders.service';

@Controller('seeders')
export class SeedersController {
  constructor(private sedersService: SeedersService) { }
  @Get('/run-seeder')
  async run() {
    // return await this.sedersService.run();
  }

  @Get('/create-country')
  async createCountry() {
    return await this.sedersService.createCountry();
  }




}
