import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonResponse } from '../user/respose-interface';
import { Repository } from 'typeorm';
import SchedulePeriod from './schedule-period.entity';

@Injectable()
export class SchedulePeriodService {

    constructor(
        @InjectRepository(SchedulePeriod)
        private schedulePeriodRepository: Repository<SchedulePeriod>,
    ) { }
    public async getSchedule() {
        const response: JsonResponse = {
            error: false,
            message: 'data retrived succesfully',
            status_code: HttpStatus.OK,
            data: await this.schedulePeriodRepository.find(),
        };
        return response;
    }
}
