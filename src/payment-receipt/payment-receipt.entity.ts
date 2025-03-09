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

    @ManyToOne(() => User, (user) => user.payment_receipts, { nullable: true, onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => SystemReceivingAccount, (systemReceivingAccount) => systemReceivingAccount.payment_receipts, { nullable: true, onDelete: 'CASCADE' })
    system_receiving_account: SystemReceivingAccount;

    @OneToOne(() => InvitationTracker, (invitationTracker) => invitationTracker.payment_receipt, { nullable: true })
    public invitation_tracker?: InvitationTracker;

    @CreateDateColumn({ type: 'timestamp' })
    public created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at: Date;
}

export default PaymentReceipt;
