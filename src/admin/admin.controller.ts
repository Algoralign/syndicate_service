import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/interfaces/request-with-user.interface';
import ApproveKYCDto from './approve-kyc.dto';
import RejectPaymentDto from './reject-payment.dto';

@Controller('admin')
export class AdminController {

    constructor(private adminService: AdminService) { }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('retrive-kycs')
    async getKycs(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query() details: any,
    ) {
        const result = await this.adminService.getKycs(details);
        return response.status(HttpStatus.OK).json(result);

    }


    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('approve-kyc')
    async approveKyc(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query() details: ApproveKYCDto,
    ) {

        console.log(details)
        const result = await this.adminService.approveKyc(details);
        return response.status(result.status_code).json(result);

    }



    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('get-users')
    async getUsers(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query() details: any,
    ) {

        const result = await this.adminService.getUsers(details);
        return response.status(result.status_code).json(result);

    }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('get-payment-receipts')
    async getPayments(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query() details: any,
    ) {

        const result = await this.adminService.getPayments(details);
        return response.status(result.status_code).json(result);

    }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Post('reject-payment-receipts')
    async rejectPayment(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Body() details: RejectPaymentDto,
    ) {

        const result = await this.adminService.rejectPayment(details);
        return response.status(result.status_code).json(result);
    }
}
