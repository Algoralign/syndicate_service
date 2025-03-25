import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User, { InviteType } from './user.entity';
import { EntityManager, Repository } from 'typeorm';
import CreateUserDto from '../_dtos/create-user.dto';

import * as bcrypt from 'bcryptjs';
import { CustomHttpException } from '../_custom-methods/custom-http-exception';
import { PostgresErrorCode } from '../_enums/postgresErrorCodes.enum';

import { EmailVerificationTokenService } from '../email-verification-token/email-verification-token.service';
import CreateUserRoleDto from '../_dtos/create-role.dto';


import { JsonResponse } from './respose-interface';
import { UserType, UserTypeArray } from '../_enums/user-type.enum';


import Country from '../country/country.entity';



import { ResetPasswordTokenService } from '../reset-password-token/reset-password-token.service';
import ChangePasswordDto from '../_dtos/change-password.dto';
import RequestPasswordVerificationEmailDto from '../_dtos/request-password-verification-email.dto';
import Address from '../address/address.entity';
import { MailService } from '../mail/mail.service';
import CreateAdminDto from '../_dtos/create-admin.dto';
import CompleteInviteDto from '../_dtos/create-invite.dto';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import Syndicate from '../syndicate/syndicate.entity';
import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';

@Injectable()
export class UserService {
  constructor(


    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(InvitationTracker)
    private invitationTrackerRepository: Repository<InvitationTracker>,

    @InjectRepository(Country)
    private countryRepository: Repository<Country>,

    @InjectRepository(Address)
    private addressRepository: Repository<Address>,

    @InjectRepository(Syndicate)
    private syndicateRepository: Repository<Syndicate>,

    @InjectRepository(InvestmentInstrument)
    private investmentInstrumentRepository: Repository<InvestmentInstrument>,

    private emailVerificationTokenService: EmailVerificationTokenService,

    private resetPasswordTokenService: ResetPasswordTokenService,
    private mailService: MailService,
  ) { }

  public async getByEmail(email: string, password: string) {
    try {


      const user = await this.userRepository.findOne({
        where: { email: email },
        select: ['id', 'first_name', 'last_name', 'email', 'password', 'created_at', 'updated_at', 'verified', 'phone', 'user_type', 'invite_type'], // Explicitly include password
      });
      await this.verifyPassword(password, user.password);
      user.password = undefined;

      return {
        error: false,
        status_code: HttpStatus.OK,
        message: 'user detail retrived succesfully',
        data: user,
      };
    } catch (error) {
      throw new CustomHttpException(
        'wrong credentials provided',
        HttpStatus.BAD_REQUEST,
        { status_code: HttpStatus.BAD_REQUEST, error: true },
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    try {
      const isPasswordMatching = await bcrypt.compareSync(
        plainTextPassword,
        hashedPassword,
      );
      if (!isPasswordMatching) {
        throw new CustomHttpException(
          'wrong credentials provided',
          HttpStatus.BAD_REQUEST,
          { status_code: HttpStatus.BAD_REQUEST, error: true },
        );
      }
    } catch (error) {
      throw new CustomHttpException(
        'error logging in user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { status_code: HttpStatus.INTERNAL_SERVER_ERROR, error: true },
      );
    }
  }

  public async create(userData: CreateUserDto) {
    try {
      // Check if country exists
      const country = await this.countryRepository.findOne({ where: { id: userData.country_id } });

      if (!country) {
        return {
          error: true, // Fix: This should be `true` for an error
          status_code: HttpStatus.BAD_REQUEST,
          message: 'Country selected does not exist',
        };
      }

      //check if user exist
      const userExist = await this.userRepository.findOne({ where: { email: userData.email, } })
      if (userExist) {
        return {
          error: true, // Fix: This should be `true` for an error
          status_code: HttpStatus.BAD_REQUEST,
          message: 'duplicate account - signup rejected',
        };
      }




      const entityManager = this.userRepository.manager;
      return await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {

        // Create and save User first
        const newUser = this.userRepository.create({
          email: userData.email,
          password: await this.createPasswordHash(userData.password),
          invite_type: InviteType.SELF
        });
        const user = await transactionalEntityManager.save(User, newUser);

        // Create and save Address
        const address = this.addressRepository.create({ user, country });
        await transactionalEntityManager.save(Address, address);

        // Generate email verification token
        const token = await this.emailVerificationTokenService.createEmailverificationToken(userData.email);

        // create the syndicate 
        let syndicate = this.syndicateRepository.create({
          user: { id: user.id },
          name: userData.syndicate_name,
          description: userData.syndicate_description,
          syndicate_website: userData.syndicate_website,
        })
        await transactionalEntityManager.save(Syndicate, syndicate);

        // Prepare response data
        const data = {
          email: user.email,
          email_verification_token: token.token,
          verified: user.verified,
          verification_link: `${process.env.ROOT_URL}/verify-email?token=${token.token}`,
        };

        // Send email verification mail (if needed)
        await this.mailService.sendUserConfirmation(data);

        return {
          error: false,
          status_code: HttpStatus.OK,
          message: 'User account created',
        };
      })

    } catch (error) {
      console.log(error)
      if (error?.code == PostgresErrorCode.UniqueViolation) {
        throw new CustomHttpException(
          'User email already exists',
          HttpStatus.BAD_REQUEST,
          { status_code: HttpStatus.BAD_REQUEST, error: true },
        );
      }
      throw new CustomHttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { status_code: HttpStatus.INTERNAL_SERVER_ERROR, error: true },
      );
    }
  }


  public async completeInviteSignup(userData: CompleteInviteDto) {
    try {
      return await this.userRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
        // Fetch invitation inside transaction
        const invitee = await this.invitationTrackerRepository.findOne({
          where: { id: userData.invite_id },
        });

        if (!invitee) {
          return {
            error: true,
            status_code: HttpStatus.BAD_REQUEST,
            message: 'Invalid invitation',
          };
        }

        if (invitee.user) {
          return {
            error: true,
            status_code: HttpStatus.BAD_REQUEST,
            message: 'This invitation has already been used',
          };
        }

        // Fetch country inside transaction
        const country = await this.countryRepository.findOne({
          where: { id: userData.country_id },
        });

        if (!country) {
          return {
            error: true,
            status_code: HttpStatus.BAD_REQUEST,
            message: 'Country selected does not exist',
          };
        }

        // Check if user already exists
        const userExist = await this.userRepository.findOne({ where: { email: invitee.email } });
        if (userExist) {
          return {
            error: true,
            status_code: HttpStatus.BAD_REQUEST,
            message: 'You already have an account. Please log in to check the invitation tab for deal details.',
          };
        }

        // Hash password outside transaction
        const hashedPassword = await this.createPasswordHash(userData.password);

        // Create and save User
        const newUser = this.userRepository.create({
          first_name: invitee.first_name,
          last_name: invitee.last_name,
          email: invitee.email,
          password: hashedPassword,
          verified: true,
          invite_type: InviteType.REFFERRAL,
        });

        const user = await transactionalEntityManager.save(User, newUser);

        // Create and save Address
        const address = this.addressRepository.create({ user, country });
        await transactionalEntityManager.save(Address, address);

        // Update InvitationTracker
        invitee.user = user;
        invitee.user_accepted_invite = true;
        await transactionalEntityManager.save(InvitationTracker, invitee);

        return {
          error: false,
          status_code: HttpStatus.OK,
          message: 'User account created successfully',
        };
      });
    } catch (error) {
      console.log(error);
      if (error?.code == PostgresErrorCode.UniqueViolation) {
        throw new CustomHttpException(
          'User email already exists',
          HttpStatus.BAD_REQUEST,
          { status_code: HttpStatus.BAD_REQUEST, error: true },
        );
      }
      throw new CustomHttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { status_code: HttpStatus.INTERNAL_SERVER_ERROR, error: true },
      );
    }
  }



  public async createAdmin(userData: CreateAdminDto) {
    try {

      // Create and save User first
      const newUser = this.userRepository.create({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: await this.createPasswordHash(userData.password),
        user_type: UserType.ADMIN
      });

      const user = await this.userRepository.save(newUser);


      // Generate email verification token
      const token = await this.emailVerificationTokenService.createEmailverificationToken(userData.email);

      // Prepare response data
      const data = {
        email: user.email,
        email_verification_token: token.token,
        verified: user.verified,
        verification_link: `${process.env.ROOT_URL}/verify-email?token=${token.token}`,
      };

      // Send email verification mail (if needed)
      await this.mailService.sendUserConfirmation(data);

      return {
        error: false,
        status_code: HttpStatus.OK,
        message: 'User account created',
      };
    } catch (error) {
      console.log(error)
      if (error?.code == PostgresErrorCode.UniqueViolation) {
        throw new CustomHttpException(
          'User email already exists',
          HttpStatus.BAD_REQUEST,
          { status_code: HttpStatus.BAD_REQUEST, error: true },
        );
      }
      throw new CustomHttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { status_code: HttpStatus.INTERNAL_SERVER_ERROR, error: true },
      );
    }
  }

  public async requestVerificationEmail(userData: RequestPasswordVerificationEmailDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userData.email }
      });

      if (!user) {
        return {
          error: true,
          status_code: HttpStatus.BAD_REQUEST,
          message: 'email do not exist, please signup to lendora.ng',
        };
      }

      if (user.verified) {
        return {
          error: false,
          status_code: HttpStatus.ACCEPTED,
          message: 'your account is already verified continue to login',
        };
      }

      const token =
        await this.emailVerificationTokenService.updateCreateEmailverificationToken(
          userData.email,
        );

      const data = {
        email: user.email,
        phone: user.phone,
        email_verification_token: token.token,
        first_name: user.first_name,
        last_name: user.last_name,
        verified: user.verified,
        verification_link:
          `${process.env.ROOT_URL}` + '/verify-email?token=' + `${token.token}`,
      };

      //send email verification mail - rabbitmq
      // this.rabbitClient.emit('log.INFO', { name: 'auth', data: data });



      return {
        error: false,
        status_code: HttpStatus.ACCEPTED,
        message: 'account verification email sent',
      };
    } catch (error) {
      throw new CustomHttpException(
        'error sending verification email',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { status_code: HttpStatus.INTERNAL_SERVER_ERROR, error: true },
      );
    }
  }



  public async verifyEmail(
    token: string,
  ): Promise<{ message: string; error: boolean; status_code: number }> {
    return await this.emailVerificationTokenService.verifyEmail(token);
  }

  public async createPasswordHash(password: string) {
    try {
      return await bcrypt.hash(password, bcrypt.genSaltSync(10));
    } catch (error) {
      throw new CustomHttpException(
        'error hasing password',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { status_code: HttpStatus.INTERNAL_SERVER_ERROR, error: true },
      );
    }
  }

  public async getById(id: string) {


    // Retrieve the user from the database, including roles
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['roles'], // Load roles
    });

    if (!user) {
      throw new CustomHttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
        { status_code: HttpStatus.NOT_FOUND, error: true },
      );
    }



    // Construct the response
    const response = {
      user, // Include the original user object
    };

    // Return the new response
    return response;
  }


  public async getCountries() {
    const response: JsonResponse = {
      error: false,
      message: 'countries retrived succesfully',
      status_code: HttpStatus.OK,
      data: await this.countryRepository.find(),
    };
    return response;
  }



  public async sendResetPasswordEmail(email: string) {
    try {
      // check if user with email exist 
      let user = await this.userRepository.findOne({ where: { email: email } })

      if (!user) {

        const response: JsonResponse = {
          error: true,
          message: 'email supplied cannot be found',
          status_code: HttpStatus.BAD_REQUEST,
          data: null
        };
        return response;
      }

      // generate verification token
      const token =
        await this.resetPasswordTokenService.createEmailverificationToken(
          user.email,
        );

      const data = {
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        verified: user.verified,
        verification_link:
          `${process.env.FORGOT_PASSWORD_URL}` + '?token=' + `${token.token}`,
      };


      //send email verification mail - rabbitmq
      // this.rabbitClient.emit('log.INFO', { name: 'reset-password-email', data: data });

      const response: JsonResponse = {
        error: false,
        message: 'reset password email sent',
        status_code: HttpStatus.ACCEPTED,
        data: null
      };
      return response;
    } catch (error) {
      console.log(error)
      throw new CustomHttpException(
        'error sending reset password email',
        HttpStatus.BAD_REQUEST,
        { status_code: HttpStatus.BAD_REQUEST, error: true },
      );
    }
  }


  public async changePassword(userdata: ChangePasswordDto) {
    try {
      const token = await this.resetPasswordTokenService.getToken(userdata.token)

      if (!token) {
        const response: JsonResponse = {
          error: true,
          message: 'token supplied cannot be found',
          status_code: HttpStatus.BAD_REQUEST,
          data: null
        };
        return response;
      }

      if (token.expired == true) {
        const response: JsonResponse = {
          error: true,
          message: 'token already expired',
          status_code: HttpStatus.BAD_REQUEST,
          data: null
        };
        return response;
      }

      // update the user
      let user = await this.userRepository.findOne({ where: { email: token.email } })

      if (!user) {
        const response: JsonResponse = {
          error: true,
          message: 'user not found',
          status_code: HttpStatus.BAD_REQUEST,
          data: null
        };
        return response;
      }

      user.password = await this.createPasswordHash(userdata.password)
      await this.userRepository.save(user)

      // update the token as expired 
      await this.resetPasswordTokenService.deactivateToken(userdata.token)


      const response: JsonResponse = {
        error: false,
        message: 'user password changed succesfully',
        status_code: HttpStatus.ACCEPTED,
        data: null
      };
      return response;

    } catch (error) {
      throw new CustomHttpException(
        'error changing user password',
        HttpStatus.BAD_REQUEST,
        { status_code: HttpStatus.BAD_REQUEST, error: true },
      );
    }
  }
}
