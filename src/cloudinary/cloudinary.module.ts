import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/user.entity';
import Country from '../country/country.entity';


@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Country,
  ])],
  controllers: [CloudinaryController],
  providers: [CloudinaryService]
})
export class CloudinaryModule { }
