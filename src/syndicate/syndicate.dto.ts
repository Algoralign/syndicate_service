import { IsNotEmpty, IsString, IsNumber, IsArray, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';


class CreateSyndicateDto {
    @IsNotEmpty()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsString()
    investment_instrument_id: string;
}

export default CreateSyndicateDto;


