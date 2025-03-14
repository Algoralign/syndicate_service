import { IsNotEmpty, IsString } from 'class-validator';

class RejectPaymentDto {
    @IsNotEmpty()
    @IsString()
    receipt_id: string;


    @IsNotEmpty()
    @IsString()
    reason: string;
}



export default RejectPaymentDto;