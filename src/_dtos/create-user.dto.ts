import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { Transform } from 'class-transformer';

class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    country_id: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    investment_instrument_id: string;

    @IsNotEmpty()
    @IsString()
    syndicate_description: string;

    @IsNotEmpty()
    @IsString()
    syndicate_name: string;

    @IsNotEmpty()
    @IsString()
    syndicate_website: string;

    @IsNotEmpty()
    @Transform(({ value }) => Number(value)) // Converts the string to a number
    @IsNumber()
    ticket_size: number;

    @IsOptional() // Makes the field optional
    @Transform(({ value }) => (value !== null && value !== undefined ? Number(value) : value)) // Converts only if present
    @IsNumber()
    percentage_fee?: number;

}



export default CreateUserDto;