import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

import Country from '../country.entity';


export class LocationDto {
  @IsNumber()
  code: number;

  @IsBoolean()
  status: boolean;

  @IsString()
  message: string;

  @IsArray()
  data: Country[]
}
