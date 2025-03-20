import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import User from '../user/user.entity';
import SystemReceivingAccount from '../system-receiving-account/system-receiving-account.entity';
import { Deal } from '../deal/deal.entity';
import Syndicate from '../syndicate/syndicate.entity';
import { Investment } from '../investments/investments.entity';


@Entity({ name: 'payment_receipts' })
class PaymentReceipt {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ nullable: true })
    recipt_img: string;

    @Column({ default: false })
    public approved: boolean;

    @Column({ default: false })
    public rejected: boolean;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
    investment_amount: number;
    
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
    investment_fee: number;  // percentage in monetary value based on the proposed amount & percentage_fee on syndicate percentage_fee

    @ManyToOne(() => User, (user) => user.payment_receipts, { nullable: true, onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Deal, (deal) => deal.payment_receipts, { nullable: true, onDelete: 'CASCADE' })
    deal: Deal;

    @ManyToOne(() => Syndicate, (syndicate) => syndicate.payment_receipts, { nullable: true, onDelete: 'CASCADE' })
    syndicate: Syndicate;


    @OneToOne(() => Investment, (investment) => investment.payment_receipt, { nullable: false, onDelete: 'CASCADE' })
    investment: Investment;

    @ManyToOne(() => SystemReceivingAccount, (systemReceivingAccount) => systemReceivingAccount.payment_receipts, { nullable: true, onDelete: 'CASCADE' })
    system_receiving_account: SystemReceivingAccount;

    @OneToOne(() => InvitationTracker, (invitationTracker) => invitationTracker.payment_receipt, { nullable: true })
    public invitation_tracker?: InvitationTracker;

    @Column({ type: 'text', nullable: true })
    reject_reason: string;

    @CreateDateColumn({ type: 'timestamp' })
    public created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at: Date;
}

export default PaymentReceipt;
