import { IsNotEmpty, IsUUID } from "class-validator";

class CreatePaymentDto {
    @IsUUID()
    @IsNotEmpty()
    syndicate_id: string;

}

export default CreatePaymentDto;