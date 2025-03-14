import { IsNotEmpty, IsUUID } from "class-validator";

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
}

export default CreatePaymentDto;