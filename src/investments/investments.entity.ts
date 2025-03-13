import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import User from '../user/user.entity';
import { Deal } from '../deal/deal.entity';
import Syndicate from '../syndicate/syndicate.entity';

export enum InvestmentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
}


export enum Currency {
    EUR = 'EUR',
    GBP = 'GBP',
    CHF = 'CHF',
    SEK = 'SEK',
    NOK = 'NOK',
    DKK = 'DKK',
    PLN = 'PLN',
    CZK = 'CZK',
    HUF = 'HUF',
    RON = 'RON',
    BGN = 'BGN',
    HRK = 'HRK',
    RSD = 'RSD',
    UAH = 'UAH',
    RUB = 'RUB',
    NGN = 'NGN', // Nigeria
    ZAR = 'ZAR', // South Africa
    EGP = 'EGP', // Egypt
    KES = 'KES', // Kenya
    GHS = 'GHS', // Ghana
    DZD = 'DZD', // Algeria
    MAD = 'MAD', // Morocco
    UGX = 'UGX', // Uganda
    TND = 'TND', // Tunisia
    XOF = 'XOF', // West African CFA franc
    XAF = 'XAF', // Central African CFA franc
    SCR = 'SCR', // Seychelles
    MUR = 'MUR', // Mauritius
    BWP = 'BWP', // Botswana
    NAD = 'NAD', // Namibia
    SDG = 'SDG', // Sudan
    CDF = 'CDF', // DR Congo
    TZS = 'TZS', // Tanzania
    ZMW = 'ZMW', // Zambia
    SOS = 'SOS', // Somalia
    RWF = 'RWF', // Rwanda
    ETB = 'ETB', // Ethiopia
    LSL = 'LSL', // Lesotho
    SZL = 'SZL', // Eswatini
    MZN = 'MZN', // Mozambique
    GMD = 'GMD', // Gambia
    BIF = 'BIF', // Burundi
    MWK = 'MWK', // Malawi
    ERN = 'ERN', // Eritrea
    LYD = 'LYD', // Libya
    SLL = 'SLL', // Sierra Leone
    CVE = 'CVE',  // Cape Verde
    USD = 'USD', // United States
    CAD = 'CAD', // Canada
    MXN = 'MXN', // Mexico
    BRL = 'BRL', // Brazil
    ARS = 'ARS', // Argentina
    CLP = 'CLP', // Chile
    COP = 'COP', // Colombia
    PEN = 'PEN', // Peru
    VES = 'VES', // Venezuela
    INR = 'INR', // India
    CNY = 'CNY', // China
    JPY = 'JPY', // Japan
    KRW = 'KRW', // South Korea
    IDR = 'IDR', // Indonesia
    MYR = 'MYR', // Malaysia
    PHP = 'PHP', // Philippines
    SGD = 'SGD', // Singapore
    THB = 'THB', // Thailand
    VND = 'VND'  // Vietnam
}


@Entity('investments')
export class Investment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.investments, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Deal, (deal) => deal.investments, { nullable: false, onDelete: 'CASCADE' })
    deal: Deal;

    @ManyToOne(() => Syndicate, (syndicate) => syndicate.investments, { nullable: false, onDelete: 'CASCADE' })
    syndicate: Syndicate;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
    investment_amount: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
    proposed_amount: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    actual_disbursed_amount: number; // Amount actually disbursed

    @Column({ type: 'date', nullable: true })
    disbursement_date: Date; // Date of fund disbursement

    @Column({ type: 'enum', enum: InvestmentStatus, default: InvestmentStatus.PENDING })
    investment_status: InvestmentStatus;

    @Column({ type: 'enum', enum: Currency, default: Currency.USD })
    currency: Currency;

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
