import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../user/user.entity';
import { randomInt } from 'crypto';
dotenv.config();
@Injectable()
export class UtilityService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }
    /**
     * This handler returns a 5 digit integer for phoen verification
     * @returns
     */
    async generateOtpCode(): Promise<string> {
        try {
            const code = (Math.floor(Math.random() * 10000) + 100000)
                .toString()
                .substring(1);
            return code;
        } catch (error) {
            throw new BadRequestException();
        }
    }

    /**
     * Create a Cryptographic hash
     * @param phone
     * @returns
     */
    async createCrypHash(phone: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(phone, salt);
        return hash;
    }

    /**
     *
     * @param req
     * @returns
     */
    async verifyBearerToken(req: any) {
        try {
            //extract request Headers

            const bearerToken = JSON.parse(JSON.stringify(req.headers));
            //extract bearer token

            const { authorization } = bearerToken;

            //remove pick jwt claims token
            const payLoadArr = authorization.split(' ')[1];

            //verify token claims
            const verified: any = jwt.verify(payLoadArr, process.env.JWT_SECRET);


            //check user
            const user = await this.userRepository.findOneBy({
                id: verified.userId,
            });


            console.log(user, "testing if it works")
            return user;
        } catch (error) {
            console.log(error);
        }
    }


    public async generateRandomString() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 30; i++) {
            const randomIndex = randomInt(0, chars.length);
            result += chars[randomIndex];
        }
        return result;
    }


    // Function to generate n unique random strings
    public async generateUniqueRandomStrings(n) {
        const uniqueStrings = new Set();
        while (uniqueStrings.size < n) {
            uniqueStrings.add(this.generateRandomString());
        }
        return Array.from(uniqueStrings);
    }
}
