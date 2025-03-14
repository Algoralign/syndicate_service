import { IsNotEmpty, IsString } from 'class-validator';

class ApprovePaymentDto {
    @IsNotEmpty()
    @IsString()
    receipt_id: string;
}

export default ApprovePaymentDto;