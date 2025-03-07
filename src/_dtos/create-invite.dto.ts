import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class CompleteInviteDto {
    @IsNotEmpty()
    @IsString()
    country_id: string;


    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}



export default CompleteInviteDto;