import { Global, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/user.entity';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailVerificationTokenService } from '../email-verification-token/email-verification-token.service';
import EmailVerificationToken from '../email-verification-token/email-verification-token.entity';
import { Utility } from '../utilities/utility';




import Country from '../country/country.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ResetPasswordTokenService } from '../reset-password-token/reset-password-token.service';
import ResetPasswordToken from '../reset-password-token/reset-password-token.entity';
import Address from '../address/address.entity';
@Global()
@Module({
  imports: [

    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      EmailVerificationToken,
      Country,
      Address,
      ResetPasswordToken
    ])
  ],
  providers: [
    AuthenticationService,
    UserService,
    Utility,
    EmailVerificationTokenService,
    JwtStrategy,
    CloudinaryService,
    ResetPasswordTokenService
  ],
  controllers: [AuthenticationController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthenticationModule { }


// PassportModule.register({ defaultStrategy: 'jwt' }),
