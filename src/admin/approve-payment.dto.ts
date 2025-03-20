import { IsNotEmpty, IsNumber, IsOptional, IsString, } from 'class-validator';
import { Transform } from 'class-transformer';

class ApprovePaymentDto {
    @IsNotEmpty()
    @IsString()
    receipt_id: string;

    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : Number(value))) // Reject empty string
    @IsNumber()
    investment_amount: number;
}

export default ApprovePaymentDto;