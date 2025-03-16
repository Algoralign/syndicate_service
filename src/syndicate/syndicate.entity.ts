import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import User from '../user/user.entity';
import IdentityType from '../identity-types/identity-types.entity';
import { Deal } from '../deal/deal.entity';
import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';
import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import { Investment } from '../investments/investments.entity';
import PaymentReceipt from '../payment-receipt/payment-receipt.entity';
import { Transaction } from '../transaction/transaction.entity';


@Entity({ name: 'syndicates' })
class Syndicate {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ nullable: true })
    public name: string;

    @Column({ nullable: true })
    public ticket_size: number;

    @ManyToOne(() => User, (user) => user.syndicates, { nullable: false, onDelete: 'CASCADE' })
    public user: User;

    @OneToMany(() => Deal, (deal) => deal.syndicate, { cascade: true })
    public deals: Deal[];

    @OneToMany(() => Investment, (investment) => investment.syndicate)
    investments: Investment[];

    @OneToMany(() => InvitationTracker, (invitation) => invitation.syndicate)
    invitations: InvitationTracker[];

    @OneToMany(() => PaymentReceipt, (paymentReceipt) => paymentReceipt.syndicate)
    payment_receipts: PaymentReceipt[];

    @ManyToOne(() => InvestmentInstrument, (instrument) => instrument.syndicates, { nullable: true, onDelete: 'CASCADE' })
    investment_instrument: InvestmentInstrument;

    @OneToMany(() => Transaction, (transaction) => transaction.syndicate)
    transactions: Transaction[];

    @CreateDateColumn({ type: 'timestamp' })
    public created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at: Date;
}

export default Syndicate;
