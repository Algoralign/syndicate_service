import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import User from '../user/user.entity';
import { Deal } from '../deal/deal.entity';

@Entity('invitation_trackers')
export class InvitationTracker {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.sent_invitations, { nullable: true, onDelete: 'CASCADE' })
    invited_by: User;

    @ManyToOne(() => User, (user) => user.received_invitations, { nullable: true, onDelete: 'CASCADE' })
    invitee: User;

    @ManyToOne(() => Deal, (deal) => deal.invitations, { nullable: true, onDelete: 'CASCADE' })
    deal: Deal;

    @Column({ type: 'boolean', default: false })
    email_sent: boolean;

    @Column({ type: 'boolean', default: false })
    logged_in: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
