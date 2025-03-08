

import { InvitationTracker } from '../invitation-tracker/invitation-tracker.entity';
import Address from '../address/address.entity';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Deal } from '../deal/deal.entity';
import { Investment } from '../investments/investments.entity';
import { UserType } from '../_enums/user-type.enum';




@Entity({ name: 'users' })
class User {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ nullable: true })
    public first_name: string;

    @Column({ nullable: true })
    public last_name: string;

    @Index()
    @Column({ unique: true })
    public email: string;

    @Index()
    @Column({ nullable: true })
    public phone: string;

    @Column()
    public password: string;

    @Column({ default: false })
    public verified: boolean;

    @OneToOne(() => Address, (address) => address.user, { nullable: true, cascade: true, eager: true })
    public address: Address;

    @OneToMany(() => InvitationTracker, (invitation) => invitation.invited_by)
    sent_invitations: InvitationTracker[];

    @OneToMany(() => Deal, (deal) => deal.user)
    deals: Deal[];

    @OneToMany(() => Investment, (investment) => investment.user)
    investments: Investment[];

    @Column({ type: 'enum', enum: UserType, nullable: true })
    user_type?: UserType;


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updated_at: Date;
}

export default User;
