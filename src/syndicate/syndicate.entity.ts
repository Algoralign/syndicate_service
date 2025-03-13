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
import IdentityType from '../identity-types/identity-types.entity';
import { Deal } from '../deal/deal.entity';
import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';

@Entity({ name: 'syndicates' })
class Syndicate {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ nullable: true })
    public name: string;

    @ManyToOne(() => User, (user) => user.syndicates, { nullable: false, onDelete: 'CASCADE' })
    public user: User;

    @OneToOne(() => Deal, (deal) => deal.syndicate, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'deal_id' }) // Specifies the foreign key
    public deal: Deal;

    @ManyToOne(() => InvestmentInstrument, (instrument) => instrument.syndicates, { nullable: true, onDelete: 'CASCADE' })
    investment_instrument: InvestmentInstrument;

    @CreateDateColumn({ type: 'timestamp' })
    public created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at: Date;
}

export default Syndicate;
