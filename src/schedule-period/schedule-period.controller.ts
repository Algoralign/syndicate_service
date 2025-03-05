import { Controller, Get, HttpCode, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import RequestWithUser from '../authentication/interfaces/request-with-user.interface';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { SchedulePeriodService } from './schedule-period.service';

@Controller('schedule')
export class SchedulePeriodController {


    constructor(private schedulePeriodService: SchedulePeriodService) { }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('retrieve-schedule')
    async getSchedule(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        const result = await this.schedulePeriodService.getSchedule();
        return response.status(HttpStatus.ACCEPTED).json(result);

    }
}
