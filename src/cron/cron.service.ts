import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from '../deal/deal.entity';
import { Repository } from 'typeorm';
import User from '../user/user.entity';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { Investment } from '../investments/investments.entity';
import { Cron } from '@nestjs/schedule';
import { MailService } from '../mail/mail.service';
import { InvestorInvite } from './cron.interface';

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
                where: { email_sent: false, user_type: "investor" },
                relations: ['invitee', 'deal', 'deal.user'],
            })


            for (const user of invitations) {

                const deal_creator = user.deal.user;
                const deal = user.deal;
                const invitee = user.invitee;


                // // get the user proposed investment
                const proposedInvestment = await this.investmentRepository.findOne({
                    where: { user: { id: invitee.id } },
                    relations: ["user"] // Ensure the relation is loaded if needed
                });



                const data: InvestorInvite = {
                    investor_name: invitee.first_name + " " + invitee.last_name,
                    syndicate_name: deal_creator.first_name + " " + deal_creator.last_name,
                    startup_name: deal.startup_name,
                    syndicate_lead_name: deal_creator.first_name + " " + deal_creator.last_name,
                    minimum_investment: proposedInvestment.proposed_amount,
                    currency: proposedInvestment.currency,
                    receiver: invitee.email,
                    review_deal_link: `${process.env.ROOT_URL}` + '/signup/invite?token=' + `${invitee.id}`,
                    tracker_id: user.id,
                }


                await this.mailService.sendInvestorInviteEmail(data);
            }


        } catch (error) {
            console.log(error)
        }
    }
}
