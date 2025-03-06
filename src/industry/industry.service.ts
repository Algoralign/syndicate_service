import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Industry from './industry.entity';
import { JsonResponse } from '../user/respose-interface';
import { Repository } from 'typeorm';

@Injectable()
export class IndustryService {
    constructor(
        @InjectRepository(Industry)
        private industryRepository: Repository<Industry>,
    ) { }
    public async getIndustry() {
        const response: JsonResponse = {
            error: false,
            message: 'industries retrived succesfully',
            status_code: HttpStatus.OK,
            data: await this.industryRepository.find(),
        };
        return response;
    }
}
