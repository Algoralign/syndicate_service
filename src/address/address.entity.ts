import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import User from '../user/user.entity';
import Country from '../country/country.entity';

@Entity({ name: 'addresses' })
class Address {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @OneToOne(() => User, (user) => user.address, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: User;


    @ManyToOne(() => Country, { nullable: true, eager: true })
    @JoinColumn({ name: 'country_id' })
    public country: Country;


    @Column({ nullable: true })
    public residential_address: string;

    @Column({ nullable: true })
    public address_evidence: string;

    @Column({ default: false })
    public verified: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    public updated_at: Date;
}

export default Address;
