import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import User from '../user/user.entity';
import { Deal } from '../deal/deal.entity';
import Syndicate from '../syndicate/syndicate.entity';
import { Currency } from '../_enums/currency.enum';


export enum TransactionType {
    INVESTMENT = 'investment',
    WITHDRAWAL = 'withdrawal',
    REFUND = 'refund',
}

export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.transactions, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Deal, (deal) => deal.transactions, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'deal_id' })
    deal?: Deal;

    @ManyToOne(() => Syndicate, (syndicate) => syndicate.transactions, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'syndicate_id' })
    syndicate?: Syndicate;

    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
    status: TransactionStatus;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: Currency, default: Currency.USD })
    currency: Currency;

    @Column({ type: 'varchar', nullable: true })
    reference?: string; // Transaction reference for tracking

    @Column({ type: 'varchar', nullable: true })
    payment_gateway?: string; // Payment processor (e.g., Stripe, PayPal, Bank Transfer)

    @Column({ type: 'varchar', nullable: true })
    bank_name?: string; // For bank transfers

    @Column({ type: 'varchar', nullable: true })
    receipt_url?: string; // Link to uploaded receipt

    @Column({ type: 'varchar', nullable: true })
    initiated_by?: string; // User or Admin

    @Column({ type: 'text', nullable: true })
    notes?: string; // Additional transaction details

    @CreateDateColumn({ type: 'timestamp' })
    public created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at: Date;
}
