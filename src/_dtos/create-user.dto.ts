import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}



export default CreateUserDto;