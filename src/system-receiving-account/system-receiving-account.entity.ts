

import PaymentReceipt from '../payment-receipt/payment-receipt.entity';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'system_receiving_accounts' })
class SystemReceivingAccount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    account_name: string;

    @Column({ nullable: true })
    account_number_iban: string;

    @Column({ nullable: true })
    bank_name: string;

    @Column({ nullable: true })
    currency: string;

    @Column({ nullable: true })
    swift_bic_code: string;

    @Column({ nullable: true })
    routing_number: string;

    @Column({ nullable: true })
    sort_code: string;

    @Column({ nullable: true })
    address: string;

    @OneToMany(() => PaymentReceipt, (paymentReceipt) => paymentReceipt.system_receiving_account)
    payment_receipts: PaymentReceipt[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updated_at: Date;
}


export default SystemReceivingAccount;