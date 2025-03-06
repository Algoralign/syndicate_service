import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import InvestmentInstrument from './investment-instrument.entity';
import { JsonResponse } from 'src/user/respose-interface';
import { Repository } from 'typeorm';

@Injectable()
export class InvestmentInstrumentService {

    constructor(
        @InjectRepository(InvestmentInstrument)
        private InvestmentInstrumenteRepository: Repository<InvestmentInstrument>,
    ) { }
    public async getInstruments() {
        const response: JsonResponse = {
            error: false,
            message: 'data retrived succesfully',
            status_code: HttpStatus.OK,
            data: await this.InvestmentInstrumenteRepository.find(),
        };
        return response;
    }
}
