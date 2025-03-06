import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import User from '../user/user.entity';
import EmailVerificationToken from '../email-verification-token/email-verification-token.entity';
import * as postmark from 'postmark';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { InvestorInvite } from '../cron/cron.interface';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MailService {
  private readonly client: postmark.Client;

  constructor(
    private config: ConfigService,
    private mailerService: MailerService,

    @InjectRepository(InvitationTracker) private invitationTrackerRepository: Repository<InvitationTracker>,
  ) {
    this.client = new postmark.Client(this.config.get(`POSTMARK_SERVER_TOKEN`));
  }

  async sendUserConfirmation(
    data: any
  ): Promise<void> {
    try {

      const templatePath = 'src/mail/templates/confirmation.hbs';
      const template = fs.readFileSync(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(template);
      const htmlBody = compiledTemplate({
        name: data.email,
        login_url: `${this.config.get('ROOT_URL')}`,
        url: data.verification_link,
      });

      await this.client.sendEmail({
        From: `"Algoralign" <${this.config.get(`MAIL_FROM`)}>`,
        To: data.email,
        Subject: 'Welcome to Algoralign, please confirm your email',
        HtmlBody: htmlBody,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendAccountConfirmationSuccessMail(user: User) {
    try {
      const templatePath = 'src/mail/templates/confirmation-success.hbs';

      const template = fs.readFileSync(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(template);
      const htmlBody = compiledTemplate({
        name: user.email,
        login_url: `${this.config.get('LOGIN_URL')}`,
      });

      await this.client.sendEmail({
        From: `${this.config.get(`MAIL_FROM`)}`,
        To: user.email,
        Subject: 'Welcome to Algoralign, Acount Confirmed Successfully',
        HtmlBody: htmlBody,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }


  async sendInvestorInviteEmail(
    data: InvestorInvite
  ): Promise<void> {

    console.log("reached here")
    try {

      const templatePath = 'src/mail/templates/investor-invite.hbs';
      const template = fs.readFileSync(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(template);
      const htmlBody = compiledTemplate(data);

      const response = await this.client.sendEmail({
        From: `"Algoralign" <${this.config.get(`MAIL_FROM`)}>`,
        To: data.receiver,
        Subject: 'You’ve Been Invited by' + " " + data.syndicate_lead_name + " " + 'to Join a Deal on Algoralign',
        HtmlBody: htmlBody,
      });

      if (response.ErrorCode == 0) {
        const tracker = await this.invitationTrackerRepository.findOne({ where: { id: data.tracker_id } })
        tracker.email_sent = true
        await this.invitationTrackerRepository.save(tracker);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
