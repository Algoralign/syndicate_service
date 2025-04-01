import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class ApproveKYCDto {
    @IsNotEmpty()
    @IsString()
    id: string;


    @IsNotEmpty()
    @IsString()
    verified: string;

    @IsOptional()
    @IsString()
    failed_reason: string;
}



export default ApproveKYCDto;