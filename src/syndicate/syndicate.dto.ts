import { IsNotEmpty, IsString, IsNumber, IsArray, IsUUID, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';


class CreateSyndicateDto {

    @IsNotEmpty()
    @IsString()
    syndicate_description: string;

    @IsNotEmpty()
    @IsString()
    syndicate_name: string;

    @IsNotEmpty()
    @IsString()
    syndicate_website: string;

}

export default CreateSyndicateDto;


