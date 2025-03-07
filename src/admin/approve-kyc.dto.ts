import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class ApproveKYCDto {
    @IsNotEmpty()
    @IsString()
    id: string;


    @IsNotEmpty()
    @IsString()
    verified: string;

    @IsNotEmpty()
    @IsString()
    failed_reason: string;
}



export default ApproveKYCDto;