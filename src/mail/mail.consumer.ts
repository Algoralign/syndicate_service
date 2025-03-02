import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';
import { Logger } from '@nestjs/common';

// @Processor(process.env.MAIL_QUEUE)
export class MailConsumer {
  protected logger = new Logger(MailConsumer.name);
  constructor(private mailService: MailService) {}

  // @OnQueueActive()
  // onActive(job: Job) {
  //   this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  // }

  // @OnQueueCompleted()
  // onComplete(job: Job, result: any) {
  //   this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  // }

  // @OnQueueFailed()
  // onError(job: Job<any>, error: any) {
  //   this.logger.error(
  //     `Failed job ${job.id} of type ${job.name}: ${error.message}`,
  //     error.stack,
  //   );
  // }

  // @Process('EMAIL_CONFIRMATION_JOB')
  // async sendMail(job: Job<User>) {}

  // @Process('PASSWORD_RESET_LINK_JOB')
  // async sendPasswordResetLink(job: Job<User>) {}

  // @Process('EMAIL_CONFIRMATION_SUCCESS_JOB')
  // async sendAccountConfirmationSuccessMail(job: Job<User>) {}

  // @Process('LOAN_APPROVAL_JOB')
  // async sendLoanApprovalMail(job: Job<Loan>) {}

  // @Process('LOAN_DECLINED_JOB')
  // async sendLoanDeclinedMailToRetailer(job: Job<Loan>) {}

  // @Process('DISTRIBUTOR_ADDED_RETAILER_MAIL_JOB')
  // async sendMailNoticeToRetailerAddedByDistributor(job: Job<User>) {}

  // @Process('SEND_REQUEST_APPROVAL_MAIL_TO_DISTRIBUTOR')
  // async sendApprovalNoticeMailToDistributor(job: Job<DistributorLoanRequest>) {}

  // @Process('SEND_APPROVAL_PROCESSED_MAIL_TO_MANUFACTURER')
  // async sendApprovedLoanProcessingMailToManufacturer(
  //   job: Job<DistributorLoanRequest>,
  // ) {}

  // @Process('SEND_INVITATION_LINK_TO_DISTRIBUTOR')
  // async sendInvitationLinkToDistributor(job: Job<any>) {}
}
