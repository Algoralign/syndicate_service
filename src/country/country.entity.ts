

import Address from '../address/address.entity';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'countries' })
class Country {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    continent: string;

    @Column({ nullable: true })
    dial_code: string;

    @Column({ nullable: true })
    value: string;

    @OneToMany(() => Address, (address) => address.country, { cascade: ['remove'] })
    public addresses: Address[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updated_at: Date;
}


export default Country;