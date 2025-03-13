import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/interfaces/request-with-user.interface';
import CreateSyndicateDto from './syndicate.dto';
import { SyndicateService } from './syndicate.service';
import User from 'src/user/user.entity';

@Controller('syndicate')
export class SyndicateController {

    constructor(private syndicateService: SyndicateService) { }

    @UseGuards(JwtAuthenticationGuard)
    @Post('/submit-syndicate')
    async submitDeal(
        @Body() details: CreateSyndicateDto,
        @Req() request: RequestWithUser,
    ): Promise<any> {
        return await this.syndicateService.submitDeal(request.user, details);
    }



    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('/retrieve-user-syndicates')
    async getCreatedSyndicate(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query() details: any,
    ) {

        const user: User = request.user['data'].user

        const result = await this.syndicateService.getUserSyndicates(user, details);
        return response.status(result.status_code).json(result);

    }


    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('/get-syndicate/:id') // Change {id} to :id
    async getSyndicateById(
        @Req() request: RequestWithUser,
        @Param('id') id: string, // Retrieve the id from the route
        @Res() response: Response,
    ) {
        const user: User = request.user['data'].user;

        const result = await this.syndicateService.getSyndicateById(id); // Pass id to the service

        return response.status(result.status_code).json(result); // Explicitly set status and return JSON response
    }

}
