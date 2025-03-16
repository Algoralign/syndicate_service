import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames
import RequestWithUser from '../authentication/interfaces/request-with-user.interface';
import { DealService } from './deal.service';
import CreateDealDto from './deal.dto';
import User from '../user/user.entity';
import CreatePaymentDto from './payment.dto';



export const storage = {
    storage: diskStorage({
        destination: './uploads/deals-document',
        filename: (req, file, cb) => {
            const splitFileName = file.originalname.split('.');
            const extension = splitFileName.length - 1;
            cb(null, uuidv4() + '.' + splitFileName[extension]);
        },
    }),
};

export const storagePayment = {
    storage: diskStorage({
        destination: './uploads/payment-document',
        filename: (req, file, cb) => {
            const splitFileName = file.originalname.split('.');
            const extension = splitFileName.length - 1;
            cb(null, uuidv4() + '.' + splitFileName[extension]);
        },
    }),
};


@Controller('deal')
export class DealController {

    constructor(private dealService: DealService) { }

    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'waterfall_distribution_structure', maxCount: 1 },
                { name: 'angel_waterfall_distribution_structure', maxCount: 1 },
            ],
            storage,
        ),
    )
    @UseGuards(JwtAuthenticationGuard)
    @Post('/submit-deal')
    async submitDeal(
        @Body() details: CreateDealDto,
        @Req() request: RequestWithUser,
        @UploadedFiles()
        files: {
            waterfall_distribution_structure?: Express.Multer.File[];
            angel_waterfall_distribution_structure?: Express.Multer.File[];
        },
    ): Promise<any> {
        return await this.dealService.submitDeal(files, request.user, details);
    }




    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'receipt_img', maxCount: 1 },
            ],
            storagePayment,
        ),
    )
    @UseGuards(JwtAuthenticationGuard)
    @Post('/upload-payment')
    async uploadPayment(
        @Body() details: CreatePaymentDto,
        @Req() request: RequestWithUser,
        @UploadedFiles()
        files: {
            receipt_img?: Express.Multer.File[];
        },
    ): Promise<any> {

        const user: User = request.user['data'].user
        return await this.dealService.uploadPayment(files, user, details);
    }


    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('retrieve-currency')
    async getCurrency(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        const result = await this.dealService.getCurrency();
        return response.status(result.status_code).json(result);

    }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('system-banks')
    async getSystemBank(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        const result = await this.dealService.getSystemBank();
        return response.status(result.status_code).json(result);

    }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('user-pending-deal')
    async getUserpendingdeal(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query() details: any,
    ) {

        const user: User = request.user['data'].user
        const result = await this.dealService.getUserPendingDeal(user, details);
        return response.status(result.status_code).json(result);

    }


    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('user-onboarded-deals')
    async getDeals(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query() details: any,
    ) {

        const user: User = request.user['data'].user

        const result = await this.dealService.getUserOnboardedDeals(user, details);
        return response.status(result.status_code).json(result);

    }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('user-created-deals')
    async getCreatedDeals(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query() details: any,
    ) {

        const user: User = request.user['data'].user

        const result = await this.dealService.getCreatedDeals(user, details);
        return response.status(result.status_code).json(result);

    }


    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('invites')
    async getDealInvites(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query() details: any,
    ) {

        const user: User = request.user['data'].user

        const result = await this.dealService.getDealInvites(user, details);
        return response.status(result.status_code).json(result);

    }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('user-created-syndicates')
    async getCreatedSyndicates(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query() details: any,
    ) {

        const user: User = request.user['data'].user

        const result = await this.dealService.getCreatedSyndicates(user, details);
        return response.status(result.status_code).json(result);

    }


    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Get('get-deal') // Change {id} to :id
    async getSyndicateById(
        @Req() request: RequestWithUser,
        @Query() details: any,
        @Res() response: Response,
    ) {
        const user: User = request.user['data'].user
        const result = await this.dealService.getDealById(details, user); // Pass id to the service
        return response.status(result.status_code).json(result); // Explicitly set status and return JSON response
    }

}
