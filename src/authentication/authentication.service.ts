import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import CreateUserDto from 'src/_dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import CreateUserRoleDto from 'src/_dtos/create-role.dto';
import User from '../user/user.entity';
import LoginUserDto from '../_dtos/login-user.dto';

import { CloudinaryService } from '../cloudinary/cloudinary.service';


import { UserTypeArray } from '../_enums/user-type.enum';

import ResetPasswordEmailDto from '../_dtos/reset-password-email.dto';
import ChangePasswordDto from '../_dtos/change-password.dto';
import RequestPasswordVerificationEmailDto from '../_dtos/request-password-verification-email.dto';
import { IdentityTypesService } from '../identity-types/identity-types.service';
import { BankService } from '../bank/bank.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private cloudinaryService: CloudinaryService,
    private identityTypesService: IdentityTypesService,
    private bankService: BankService,

  ) { }

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
