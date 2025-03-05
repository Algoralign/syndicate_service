import { Controller, Get, HttpCode, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import RequestWithUser from '../authentication/interfaces/request-with-user.interface';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { IndustryService } from './industry.service';

@Controller('industry')
export class IndustryController {

    constructor(private industryService: IndustryService) { }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('retrieve-industry')
    async getIndustry(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        const result = await this.industryService.getIndustry();
        return response.status(HttpStatus.ACCEPTED).json(result);

    }
}
