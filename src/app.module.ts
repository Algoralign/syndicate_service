import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { entities } from '../entities';
import { AuthenticationModule } from './authentication/authentication.module';
import { UtilitiesModule } from './utilities/utilities.module';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { CountryModule } from './country/country.module';
import { EmailVerificationTokenModule } from './email-verification-token/email-verification-token.module';
import { ResetPasswordTokenModule } from './reset-password-token/reset-password-token.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SeedersModule } from './seeders/seeders.module';
import { MailModule } from './mail/mail.module';
import { BankModule } from './bank/bank.module';
import { IdentityTypesModule } from './identity-types/identity-types.module';
import { KycModule } from './kyc/kyc.module';
import { InvestmentInstrumentModule } from './investment-instrument/investment-instrument.module';
import { IndustryModule } from './industry/industry.module';
import { SchedulePeriodModule } from './schedule-period/schedule-period.module';
import { DealModule } from './deal/deal.module';
import { InvitationTrackerModule } from './invitation-tracker/invitation-tracker.module';
import { InvestmentsModule } from './investments/investments.module';






@Module({
  imports: [

    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('DATABASE_HOST'),
          url: config.get<string>('DATABASE_URL'),
          port: config.get<number>('DATABASE_PORT'),
          username: config.get<string>('DATABASE_USER'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
          synchronize: false,
          ssl: {
            rejectUnauthorized: false, // Disable SSL verification
          },
          entities,
        };
      },
    }),

    AuthenticationModule,
    UserModule,
    UtilitiesModule,
    AddressModule,
    CountryModule,
    EmailVerificationTokenModule,
    ResetPasswordTokenModule,
    CloudinaryModule,
    SeedersModule,
    MailModule,
    BankModule,
    IdentityTypesModule,
    KycModule,
    InvestmentInstrumentModule,
    IndustryModule,
    SchedulePeriodModule,
    DealModule,
    InvitationTrackerModule,
    InvestmentsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
