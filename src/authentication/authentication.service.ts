import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import CreateUserDto from 'src/_dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import CreateUserRoleDto from 'src/_dtos/create-role.dto';
import User from '../user/user.entity';
import LoginUserDto from '../_dtos/login-user.dto';

import { CloudinaryService } from '../cloudinary/cloudinary.service';




import ResetPasswordEmailDto from '../_dtos/reset-password-email.dto';
import ChangePasswordDto from '../_dtos/change-password.dto';
import RequestPasswordVerificationEmailDto from '../_dtos/request-password-verification-email.dto';
import { IdentityTypesService } from '../identity-types/identity-types.service';
import { BankService } from '../bank/bank.service';
import Kyc from '../kyc/kyc.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import IdentityType from '../identity-types/identity-types.entity';
import { Bank } from '../bank/bank.entity';
import CreateAdminDto from '../_dtos/create-admin.dto';
import CompleteInviteDto from '../_dtos/create-invite.dto';


import * as fs from 'fs';
import { promisify } from 'util';
import * as path from 'path';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private cloudinaryService: CloudinaryService,
    private identityTypesService: IdentityTypesService,
    private bankService: BankService,

    @InjectRepository(Kyc)
    private kycRepository: Repository<Kyc>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(IdentityType)
    private identityTypeRepository: Repository<IdentityType>,

    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,

  ) { }


  async verifyIdentity(files: any, user: any, details: any): Promise<any> {
    try {
      if (!files || !files.passport || !files.id_image || !files.address_evidence) {
        throw new BadRequestException('All three images (passport, ID, address evidence) are required');
      }

      const userExist = await this.userRepository.findOneBy({ id: user.data.user.id })

      if (!user) {
        throw new BadRequestException('user unauthorized');
      }

      const kycExist = await this.kycRepository
        .createQueryBuilder('kyc')
        .where('kyc.user_id = :userId', { userId: userExist.id })
        .getOne();


      if (kycExist && kycExist.uploaded) {
        return {
          status_code: 400,
          error: true,
          message: 'you have previously uploaded your kyc details, you can no longer upload new documents',
        };
      }

      // check id type
      const idTypeExist = await this.identityTypeRepository.findOne({ where: { id: details.id_type } })
      if (!idTypeExist) {
        return {
          status_code: 400,
          error: true,
          message: 'id type selected do not exist',
        };
      }

      const bankExist = await this.bankRepository.findOne({ where: { id: details.bank_id } })
      if (!bankExist) {
        return {
          status_code: 400,
          error: true,
          message: 'bank  selected do not exist',
        };
      }
      // Upload files with error handling
      const uploadResults = await Promise.allSettled([
        this.uploadWithRetry(files.passport[0], userExist.email),
        this.uploadWithRetry(files.id_image[0], userExist.email),
        this.uploadWithRetry(files.address_evidence[0], userExist.email)
      ]);

      // Extract results
      const passportUrl = uploadResults[0].status === 'fulfilled' ? uploadResults[0].value : null;
      const idImageUrl = uploadResults[1].status === 'fulfilled' ? uploadResults[1].value : null;
      const addressEvidenceUrl = uploadResults[2].status === 'fulfilled' ? uploadResults[2].value : null;

      // Check if any upload failed
      if (!passportUrl || !idImageUrl || !addressEvidenceUrl) {
        throw new Error('One or more document uploads failed. Please try again.');
      }


      // Save KYC details if all uploads are successful
      const kyc = this.kycRepository.create({
        user: userExist,
        first_name: details.first_name,
        last_name: details.last_name,
        identityType: { id: details.id_type },
        passport: passportUrl,
        id_image: idImageUrl,
        address: details.address,
        address_evidence: addressEvidenceUrl,
        bank: { id: details.bank_id },
        account_number: details.account_number,
        bvn: details.bvn,
        swift_bic_code: details.swift_bic_code,
        account_name: details.account_name,
        phone: details.phone,
        uploaded: true
      });

      await this.kycRepository.save(kyc);


      // update the user
      userExist.first_name = details.first_name
      userExist.last_name = details.last_name
      userExist.phone = details?.phone
      await this.userRepository.save(userExist)

      return {
        status_code: 200,
        error: false,
        message: 'Verification document submitted successfully. Please wait for verification.',
        data: kyc,
      };
    } catch (error) {
      console.error('KYC Submission Error:', error);
      throw new BadRequestException({ message: error.message });
    }
  }


  async uploadWithRetry(file: any, email: string, attempts = 3): Promise<string> {
    const storagePath = path.join(path.resolve('./'), `uploads/identification-document/${file.filename}`);


    for (let i = 0; i < attempts; i++) {
      try {
        const url = await this.cloudinaryService.uploadUserDocument(file, email);
        if (url) {
          // Delete the file after successful upload
          await unlinkAsync(storagePath);
          console.log(`Deleted local file after successful upload: ${storagePath}`);
          return url;
        }
      } catch (error) {
        console.error(`Upload attempt ${i + 1} failed for ${file.filename}:`, error);
      }
    }

    // Delete file from local storage after all attempts fail
    try {
      await unlinkAsync(storagePath);
      console.log(`Deleted local file after failed upload: ${storagePath}`);
    } catch (deleteError) {
      console.error(`Failed to delete file after unsuccessful upload: ${storagePath}`, deleteError);
    }

    throw new Error(`Failed to upload ${file.filename} after ${attempts} attempts.`);
  }

  // async uploadWithRetry(file, email, attempts = 3): Promise<string> {
  //   for (let i = 0; i < attempts; i++) {
  //     try {
  //       const url = await this.cloudinaryService.uploadUserDocument(file, email);
  //       if (url) return url;
  //     } catch (error) {
  //       console.error(`Upload attempt ${i + 1} failed for ${file.filename}:`, error);
  //     }
  //   }
  //   throw new Error(`Failed to upload ${file.filename} after ${attempts} attempts.`);
  // }



  public async getJwtToken(_user: LoginUserDto) {
    const user = await this.userService.getByEmail(_user.email, _user.password);

    console.log(user);

    if (!user.data.verified) {
      return {
        error: true,
        status_code: HttpStatus.UNAUTHORIZED,
        message: 'email not verified, please verify your email',
        data: {}
      }
    }
    const userId = user.data.id;

    // return user
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return {
      error: false,
      status_code: HttpStatus.ACCEPTED,
      message: 'logged-in successfully',
      data: {
        access_token: token,
      },
    }
  }

  async createUser(userData: CreateUserDto) {
    return await this.userService.create(userData);
  }

  async completeInviteSignup(userData: CompleteInviteDto) {
    return await this.userService.completeInviteSignup(userData);
  }

  async createAdmin(userData: CreateAdminDto) {
    return await this.userService.createAdmin(userData);
  }

  async requestVerificationEmail(userData: RequestPasswordVerificationEmailDto) {
    return await this.userService.requestVerificationEmail(userData);
  }

  public async verifyEmail(
    token: string,
  ): Promise<{ message: string; error: boolean; status_code: number }> {
    return await this.userService.verifyEmail(token);
  }

  public async getAuthenticatedUser(email: string, password: string) {
    return await this.userService.getByEmail(email, password);
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }


  public async getCountries() {
    return await this.userService.getCountries();
  }


  public async sendResetPasswordEmail(userdata: ResetPasswordEmailDto) {
    return await this.userService.sendResetPasswordEmail(userdata.email);
  }

  public async changePassword(userdata: ChangePasswordDto) {
    return await this.userService.changePassword(userdata);
  }

  public async retriveIdentificationTypes() {
    return await this.identityTypesService.getAll();
  }
  public async retriveBankCountries() {
    return await this.bankService.retriveBankCountries();
  }

  public async retriveBank(code: string) {
    return await this.bankService.retriveBank(code);
  }
}
