import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import User from '../user/user.entity';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';
import Industry from '../industry/industry.entity';
import { Currency, Investment } from '../investments/investments.entity';

// Enums for repayment schedule, disbursement schedule, and SPV code
export enum RepaymentSchedule {
    MONTHLY = 'monthly',
    ANNUALLY = 'annually',
    BIANNUALLY = 'bianually',
    CUSTOM = 'custom'
}

export enum DisbursementSchedule {
    MONTHLY = 'monthly',
    ANNUALLY = 'annually',
    BIANNUALLY = 'bianually',
    CUSTOM = 'custom'
}

export enum SPVType {
    DEFAULT = 'default',
    CUSTOM = 'custom'
}

@Entity('deals')
export class Deal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.deals, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => InvitationTracker, (invitation) => invitation.deal)
    invitations: InvitationTracker[];

    @OneToMany(() => Investment, (investment) => investment.deal)
    investments: Investment[];

    @ManyToOne(() => InvestmentInstrument, (instrument) => instrument.deals, { nullable: true, onDelete: 'CASCADE' })
    investment_instrument: InvestmentInstrument;

    @Column({ type: 'varchar', length: 255, nullable: true })
    startup_name: string;

    @ManyToOne(() => Industry, (industry) => industry.deals, { nullable: true, onDelete: 'CASCADE' })
    startup_industry: Industry;

    @Column({ type: 'varchar', length: 255, nullable: true })
    founder_firstname: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    founder_lastname: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    founder_email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    startup_website: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
    funding_amount: number;

    @Column({ type: 'enum', enum: Currency, default: Currency.USD })
    currency: Currency;

    @Column({ type: 'enum', enum: RepaymentSchedule })
    repayment_schedule_code: RepaymentSchedule;

    @Column({ type: 'enum', enum: DisbursementSchedule })
    disbursement_schedule_code: DisbursementSchedule;

    @Column({ type: 'enum', enum: SPVType })
    spv_code: SPVType;

    @Column({ type: 'varchar', length: 255, nullable: true })
    spv_name: string;

    @Column({ type: 'text', nullable: true })
    investors: string;

    @Column({ type: 'text', nullable: true })
    waterfall_distribution_structure: string;

    @Column({ type: 'text', nullable: true })
    angel_waterfall_distribution_structure: string;

    @Column({ default: false })
    public verified: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
