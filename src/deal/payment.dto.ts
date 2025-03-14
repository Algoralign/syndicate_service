import { IsNotEmpty, IsString, IsNumber, IsArray, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

class CreatePaymentDto {
    @IsUUID()
    @IsNotEmpty()
    syndicate_id: string;

    @IsUUID()
    @IsNotEmpty()
    system_receiving_account_id: string;

    @IsUUID()
    @IsNotEmpty()
    invite_id: string;

    @IsNotEmpty()
    @Transform(({ value }) => (value === '' ? undefined : Number(value))) // Reject empty string
    @IsNumber()
    investment_amount: number;
}

export default CreatePaymentDto;