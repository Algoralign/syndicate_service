import { Body, Controller, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames
import RequestWithUser from '../authentication/interfaces/request-with-user.interface';
import { DealService } from './deal.service';



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


@Controller('deal')
export class DealController {

    constructor(private dealService: DealService) { }

    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'spv_file', maxCount: 1 },
                { name: 'waterfall_distribution_structure', maxCount: 1 },
                { name: 'angel_waterfall_distribution_structure', maxCount: 1 },
            ],
            storage,
        ),
    )
    @UseGuards(JwtAuthenticationGuard)
    @Post('/submit-deal')
    async submitDeal(
        @Body() details: any,
        @Req() request: RequestWithUser,
        @UploadedFiles()
        files: {
            passport?: Express.Multer.File[];
            id_image?: Express.Multer.File[];
            address_evidence?: Express.Multer.File[];
        },
    ): Promise<any> {

        return await this.dealService.submitDeal(files, request.user, details);
    }

}
