import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticationService } from './authentication.service';
import CreateUserDto from '../_dtos/create-user.dto';
import RequestWithUser from './interfaces/request-with-user.interface';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { JwtExceptionFilter } from './filters/jwt-exception.filter';

import LoginUserDto from '../_dtos/login-user.dto';

import * as path from 'path';

import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames





import { ResetPasswordEmailDto } from '../_dtos/reset-password-email.dto';
import { ChangePasswordDto } from '../_dtos/change-password.dto';
import { RequestPasswordVerificationEmailDto } from '../_dtos/request-password-verification-email.dto';

//
@Controller('authentication')
@Injectable()
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) { }

  @Post('/signup')
  async createUser(@Body() userData: CreateUserDto, @Res() response: Response) {
    const user = await this.authenticationService.createUser(userData);
    return response.status(HttpStatus.ACCEPTED).json(user);
  }


  @Post('request-verification-email')
  async requestVerificationEmail(
    @Body() userData: RequestPasswordVerificationEmailDto,
    @Res() response: Response,
  ) {
    const user = await this.authenticationService.requestVerificationEmail(userData);
    return response.status(HttpStatus.ACCEPTED).json(user);
  }

  @HttpCode(200)
  @Post('login')
  async logIn(@Body() userData: LoginUserDto, @Res() response: Response) {
    console.log(userData, "USER")
    const token = await this.authenticationService.getJwtToken(
      userData,
    );

    console.log(token)

    return response.status(token.status_code).json(token);
  }

  @UseGuards(JwtAuthenticationGuard)
  @UseFilters(JwtExceptionFilter)
  @Get('get-me')
  async getUserDetail(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const user = request.user;
    return response.status(HttpStatus.ACCEPTED).json(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @UseFilters(JwtExceptionFilter)
  @Get('verify-token')
  async authenticate(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const user = request.user;
    return response.status(HttpStatus.ACCEPTED).json(user);
  }



  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    return response.status(HttpStatus.ACCEPTED).json({
      status: true,
      status_code: 200,
      message: 'logged out successfully',
    });
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const data = await this.authenticationService.verifyEmail(token);
    const status =
      data.error == true ? HttpStatus.BAD_REQUEST : HttpStatus.ACCEPTED;
    return response.status(status).json({
      error: data.error,
      status_code: data.status_code,
      message: data.message,
      data: data,
    });
  }

  @HttpCode(200)
  @Get('countries')
  async getCountries(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const result = await this.authenticationService.getCountries();
    return response.status(HttpStatus.ACCEPTED).json(result);
  }


  @Post('reset-password-email')
  async sendResetPasswordEmail(
    @Body() userData: ResetPasswordEmailDto,
    @Res() response: Response,
  ) {

    const result = await this.authenticationService.sendResetPasswordEmail(
      userData,
    );

    const res = response.status(result.status_code).json({
      error: result.error,
      status_code: result.status_code,
      message: result.message,
      data: result.data
    });

    console.log(res)

    return res
  }

  @Post('change-password')
  async changePassword(
    @Body() userData: ChangePasswordDto,
    @Res() response: Response,
  ) {

    const result = await this.authenticationService.changePassword(
      userData,
    );
    return response.status(result.status_code).json({
      error: result.error,
      status_code: result.status_code,
      message: result.message,
      data: result.data
    });
  }


  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Get('retrieve-identification-types')
  async retriveIdentificationTypes(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const result =
      await this.authenticationService.retriveIdentificationTypes();
    return response.status(HttpStatus.OK).json({
      error: false,
      status_code: 200,
      message: 'Identification types retrived sucessfully',
      data: {
        data: result,
      },
    });
  }


  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Get('bank-country')
  async retriveBankCountries(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const result =
      await this.authenticationService.retriveBankCountries();
    return response.status(HttpStatus.OK).json({
      error: false,
      status_code: 200,
      message: 'data  retrived sucessfully',
      data: {
        data: result,
      },
    });
  }



  @Get('country-bank')
  async retriveBank(
    @Query('code') code: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {

    const data = await this.authenticationService.retriveBank(code);
    return response.status(HttpStatus.OK).json({
      error: false,
      status_code: 200,
      message: 'data  retrived sucessfully',
      data: {
        data: data,
      },
    });
  }

}
