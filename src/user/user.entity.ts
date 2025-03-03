

import Address from '../address/address.entity';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

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
