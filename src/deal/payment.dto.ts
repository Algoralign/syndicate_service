import { IsNotEmpty, IsString, IsNumber, IsArray, IsUUID, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

class CreatePaymentDto {
    @IsUUID()
    @IsNotEmpty()
    syndicate_id: string;

    @IsUUID()
    @IsNotEmpty()
    deal_id: string;

    @IsUUID()
    @IsNotEmpty()
    system_receiving_account_id: string;

    @IsUUID()
    @IsNotEmpty()
    invite_id: string;
}

export default CreatePaymentDto;