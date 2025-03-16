import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, JoinColumn, OneToOne } from 'typeorm';
import User from '../user/user.entity';
import { Deal } from '../deal/deal.entity';
import { Currency } from '../investments/investments.entity';
import PaymentReceipt from '../payment-receipt/payment-receipt.entity';
import Syndicate from '../syndicate/syndicate.entity';


@Entity('invitation_trackers')
export class InvitationTracker {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    public first_name: string;

    @Column({ nullable: true })
    public last_name: string;

    @Index()
    @Column({ nullable: true })
    public email: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
    proposed_amount: number;  // proposed investor amount that they will invest

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
    actual_amount_invested: number; // amount the user finally invested

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
    funding_amount: number; // proposed total amount to be raised for deal


    @Column({ type: 'enum', enum: Currency, default: Currency.USD })
    currency: Currency;

    @ManyToOne(() => User, (user) => user.sent_invitations, { nullable: true, onDelete: 'CASCADE' })
    invited_by: User;

    @ManyToOne(() => Deal, (deal) => deal.invitations, { nullable: true, onDelete: 'CASCADE' })
    deal: Deal;


    @ManyToOne(() => Syndicate, (syndicate) => syndicate.invitations, { nullable: true, onDelete: 'CASCADE' })
    syndicate: Syndicate;


    @OneToOne(() => PaymentReceipt, (PaymentReceipt) => PaymentReceipt.invitation_tracker, { nullable: true })
    @JoinColumn({ name: 'payment_receipt_id' })
    public payment_receipt: PaymentReceipt;


    @Column({ type: 'boolean', default: false })
    email_sent: boolean;

    @Column({ type: 'varchar', nullable: true })
    user_type: string;  // founder or investor

    @Column({ type: 'boolean', default: false })
    logged_in: boolean;

    @Column({ type: 'boolean', default: false })
    receipt_uploaded: boolean;

    @Column({ type: 'boolean', default: false })
    user_invested_in_deal: boolean;  // for both syndicate_lead & syndicate_investor

    @Column({ type: 'boolean', default: false })
    user_accepted_invite: boolean;  // for  all users

    @Column({ type: 'varchar', nullable: true })
    invite_type: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
