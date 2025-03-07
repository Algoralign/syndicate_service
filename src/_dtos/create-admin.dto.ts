import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class CreateAdminDto {

    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}



export default CreateAdminDto;