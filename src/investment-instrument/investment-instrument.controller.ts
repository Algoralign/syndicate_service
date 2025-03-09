import { Controller, Get, HttpCode, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { InvestmentInstrumentService } from './investment-instrument.service';
import { Response } from 'express';
import RequestWithUser from '../authentication/interfaces/request-with-user.interface';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

@Controller('investment-instrument')
export class InvestmentInstrumentController {

    constructor(private investmentInstrumentService: InvestmentInstrumentService) { }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('retrieve-instrument')
    async getInstruments(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        const result = await this.investmentInstrumentService.getInstruments();
        return response.status(HttpStatus.ACCEPTED).json(result);

    }

}
