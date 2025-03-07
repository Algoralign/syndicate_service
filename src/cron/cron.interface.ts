export interface InvestorInvite {
    investor_name: string;
    syndicate_name: string;
    startup_name: string;
    syndicate_lead_name: string;
    minimum_investment: number;
    currency: string;
    receiver: string;
    review_deal_link: string;
    tracker_id: string;
}

export interface FounderInvite {
    founder_name: string;
    syndicate_name: string;
    startup_name: string;
    receiver: string;
    accept_invitation_link: string;
    tracker_id: string;
}







