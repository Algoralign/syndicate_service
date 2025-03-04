import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import User from '../user/user.entity';
import { Bank } from '../bank/bank.entity';
import IdentityType from '../identity-types/identity-types.entity';

@Entity({ name: 'kycs' })
class Kyc {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @OneToOne(() => User, { nullable: false, eager: true })
    @JoinColumn({ name: 'user_id' })
    public user: User;


    @Column({ nullable: true })
    public first_name: string;

    @Column({ nullable: true })
    public last_name: string;

    @Column({ nullable: true })
    public passport: string;

    @ManyToOne(() => IdentityType, { nullable: false, eager: true })
    @JoinColumn({ name: 'id_type' })
    public identityType: IdentityType;

    @Column({ nullable: true })
    public id_image: string;

    @Column({ nullable: true })
    public address: string;

    @Column({ nullable: true })
    public address_evidence: string;

    @ManyToOne(() => Bank, { nullable: true, eager: true })
    @JoinColumn({ name: 'bank_id' })
    public bank: Bank;

    @Column({ nullable: true })
    public bvn: string;

    @Column({ nullable: true })
    public account_number: string;

    @Column({ nullable: true })
    public account_name: string;

    @Column({ default: false })
    public uploaded: boolean;

    @Column({ default: false })
    public verified: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    public created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at: Date;
}

export default Kyc;
