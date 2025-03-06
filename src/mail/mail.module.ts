import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import path, { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailConsumer } from './mail.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvitationTracker,
    ]),
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: config.get('SEND_GRID_HOST'),
          port: config.get('SEND_GRID_PORT'),
          secure: false,
          auth: {
            user: config.get('SEND_GRID_USER'),
            pass: config.get('SEND_GRID_API_KEY'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(path.resolve('./src/mail/'), 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
            allowedProtoMethods: true,
            allowCallsToHelperMissing: true,
            allowProtoMethodsByDefault: true,
            allowProtoPropertiesByDefault: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService, MailConsumer],
})
export class MailModule { }
