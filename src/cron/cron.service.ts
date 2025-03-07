import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from '../deal/deal.entity';
import { Repository } from 'typeorm';
import User from '../user/user.entity';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { Investment } from '../investments/investments.entity';
import { Cron } from '@nestjs/schedule';
import { MailService } from '../mail/mail.service';
import { FounderInvite, InvestorInvite } from './cron.interface';
import { UserType } from '../_enums/user-type.enum';

@Injectable()
export class CronService {
    constructor(
        private mailService: MailService,
        @InjectRepository(Deal) private dealRepository: Repository<Deal>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(InvitationTracker) private invitationTrackerRepository: Repository<InvitationTracker>,
        @InjectRepository(Investment) private investmentRepository: Repository<Investment>,

    ) { }



    //1. get proposal check 
    @Cron('*/5 * * * *')
    async sendInviteEmailToInvestor() {
        try {

            const invitations = await this.invitationTrackerRepository.find({
                where: { email_sent: false, user_type: 'syndicate' },
                relations: ['deal', 'deal.user'],
            })


            console.log(invitations)
            for (const invite of invitations) {

                const deal_creator = invite.deal.user;
                const deal = invite.deal;


                const data: InvestorInvite = {
                    investor_name: invite.first_name + " " + invite.last_name,
                    syndicate_name: deal_creator.first_name + " " + deal_creator.last_name,
                    startup_name: deal.startup_name,
                    syndicate_lead_name: deal_creator.first_name + " " + deal_creator.last_name,
                    minimum_investment: invite.proposed_amount,
                    currency: invite.currency,
                    receiver: invite.email,
                    review_deal_link: `${process.env.ROOT_URL}/signup/invite?token=${invite.id}&startup=${deal.startup_name}&inviteefn=${invite.first_name}&inviteeln=${invite.last_name}&leadfn=${deal_creator.first_name}&leadln=${deal_creator.last_name}`,
                    tracker_id: invite.id,
                }


                console.log(data)

                await this.mailService.sendInvestorInviteEmail(data);
            }


        } catch (error) {
            console.log(error)
        }
    }


    //1. get proposal check 
    @Cron('*/5 * * * *')
    async sendInviteEmailToFounder() {
        try {

            const invitations = await this.invitationTrackerRepository.find({
                where: { email_sent: false, user_type: UserType.FOUNDER },
                relations: ['deal', 'deal.user'],
            })


            for (const invite of invitations) {

                const deal_creator = invite.deal.user;
                const deal = invite.deal;



                const data: FounderInvite = {
                    founder_name: invite.first_name + " " + invite.last_name,
                    syndicate_name: deal_creator.first_name + " " + deal_creator.last_name,
                    startup_name: deal.startup_name,
                    receiver: invite.email,
                    accept_invitation_link: `${process.env.ROOT_URL}` + '/signup/invite?token=' + `${invite.id}`,
                    tracker_id: invite.id,
                }

                await this.mailService.sendFounderInviteEmail(data);
            }


        } catch (error) {
            console.log(error)
        }
    }
}
