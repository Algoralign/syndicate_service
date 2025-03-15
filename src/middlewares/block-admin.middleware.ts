import { Request, Response } from 'express';

import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import User from '../user/user.entity';
import { UtilityService } from '../utility/utility.service';
import { UserType } from 'src/_enums/user-type.enum';
dotenv.config();

@Injectable()
@UseGuards(AuthGuard())
export class BlockAdminMiddleware implements NestMiddleware {
    constructor(private utilityService: UtilityService) { }
    async use(req: Request, res: Response, next: () => void) {
        const user = await this.utilityService.verifyBearerToken(req);

        if (!user) {
            throw new UnauthorizedException({
                status_code: 401,
                error: true,
                message: 'Unauthorized access: Access to route denied',
            });
        } else if (user.user_type === UserType.ADMIN || user.user_type === UserType.SUPER_ADMIN) {
            throw new UnauthorizedException({
                status_code: 401,
                error: true,
                message:
                    'Access denied: admins can not participate in syndicates and investment deal',
            });
        } else if (!user.verified) {
            throw new UnauthorizedException({
                status_code: 401,
                error: true,
                message: 'Access denied: admins can not participate in syndicates and investment deal',
            });
        }
        next();
    }
}
