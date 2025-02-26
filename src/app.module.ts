import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { entities } from '../entities';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthenticationModule } from './authentication/authentication.module';


import { UtilitiesModule } from './utilities/utilities.module';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { CountryModule } from './country/country.module';





@Module({
  imports: [
    EventEmitterModule.forRoot(),
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
    BullModule.registerQueueAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        redis:
          process.env.NODE_ENV != 'development'
            ? config.get('REDIS_URL')
            : {
              host: config.get('REDIS_HOST'),
              port: config.get('REDIS_PORT'),
              password: config.get('REDIS_PASSWORD', ''),
              connectTimeout: 20000,
            },
        prefix: 'client_money_protection',
      }),
    }),
    AuthenticationModule,
    UserModule,
    UtilitiesModule,
    AddressModule,
    CountryModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
