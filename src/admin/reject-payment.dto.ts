import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

class RejectPaymentDto {
    @IsNotEmpty()
    @IsString()
    receipt_id: string;


    @IsNotEmpty()
    @IsString()
    reason: string;

    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : Number(value))) // Reject empty string
    @IsNumber()
    investment_amount: number;
}



export default RejectPaymentDto;