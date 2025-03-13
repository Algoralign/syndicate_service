import { IsEmail, IsNotEmpty, IsString, IsNumber, IsArray, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

class InvestorDto {
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
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    currency: string;
}



class CreateDealDto {
    @IsUUID()
    @IsNotEmpty()
    syndicate_id: string;

    @IsNotEmpty()
    @Transform(({ value }) => Number(value)) // Converts the string to a number
    @IsNumber()
    investing_amount: number;

    @IsNotEmpty()
    @IsString()
    startup_name: string;

    @IsUUID()
    @IsNotEmpty()
    startup_industry_id: string;

    @IsNotEmpty()
    @IsString()
    founder_firstname: string;

    @IsNotEmpty()
    @IsString()
    founder_lastname: string;

    @IsEmail()
    @IsNotEmpty()
    founder_email: string;

    @IsNotEmpty()
    @IsString()
    startup_website: string;

    @IsNotEmpty()
    @Transform(({ value }) => Number(value)) // Converts the string to a number
    @IsNumber()
    funding_amount: number;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsNotEmpty()
    @IsString()
    repayment_schedule_code: string;

    @IsNotEmpty()
    @IsString()
    disbursement_schedule_code: string;

    @IsNotEmpty()
    @IsString()
    spv_code: string;

    @IsNotEmpty()
    @IsString()
    spv_name: string;

    @IsArray()
    @IsNotEmpty()
    @Transform(({ value }) => (Array.isArray(value) ? value : JSON.parse(value))) // Ensures value is an array
    investors: InvestorDto[];
}

export default CreateDealDto;


