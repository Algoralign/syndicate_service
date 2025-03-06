import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import User from '../user/user.entity';
import { Deal } from '../deal/deal.entity';

export enum InvestmentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
}



@Entity('investments')
export class Investment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.investments, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Deal, (deal) => deal.investments, { nullable: false, onDelete: 'CASCADE' })
    deal: Deal;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
    investment_amount: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
    proposed_amount: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    actual_disbursed_amount: number; // Amount actually disbursed

    @Column({ type: 'date', nullable: true })
    disbursement_date: Date; // Date of fund disbursement

    @Column({ type: 'enum', enum: InvestmentStatus, default: InvestmentStatus.PENDING })
    investment_status: InvestmentStatus;

    @Column({ type: 'varchar', length: 10, default: 'USD' })
    currency: string;

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
