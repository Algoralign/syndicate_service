import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedersController } from './seeders.controller';
import { SeedersService } from './seeders.service';
import Country from '../country/country.entity';





import { SeederListener } from './listerners/seeders.listener';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Country,

    ]),
  ],
  controllers: [SeedersController],
  providers: [SeedersService, SeederListener],
})
export class SeedersModule { }
