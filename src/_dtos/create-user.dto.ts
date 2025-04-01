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
    syndicate_description: string;

    @IsNotEmpty()
    @IsString()
    syndicate_name: string;

    @IsOptional()
    @IsString()
    syndicate_website: string;
}



export default CreateUserDto;