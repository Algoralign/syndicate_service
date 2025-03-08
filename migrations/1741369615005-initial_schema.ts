import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1741369615005 implements MigrationInterface {
    name = 'InitialSchema1741369615005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "investment_instruments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_86e82ba26d03f052f9d17165a85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "industries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_f1626dcb2d58142d7dfcca7b8d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."investments_investment_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TYPE "public"."investments_currency_enum" AS ENUM('EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'UAH', 'RUB', 'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'DZD', 'MAD', 'UGX', 'TND', 'XOF', 'XAF', 'SCR', 'MUR', 'BWP', 'NAD', 'SDG', 'CDF', 'TZS', 'ZMW', 'SOS', 'RWF', 'ETB', 'LSL', 'SZL', 'MZN', 'GMD', 'BIF', 'MWK', 'ERN', 'LYD', 'SLL', 'CVE', 'USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'VES', 'INR', 'CNY', 'JPY', 'KRW', 'IDR', 'MYR', 'PHP', 'SGD', 'THB', 'VND')`);
        await queryRunner.query(`CREATE TABLE "investments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "investment_amount" numeric(15,2) NOT NULL DEFAULT '0', "proposed_amount" numeric(15,2) NOT NULL DEFAULT '0', "actual_disbursed_amount" numeric(15,2), "disbursement_date" date, "investment_status" "public"."investments_investment_status_enum" NOT NULL DEFAULT 'PENDING', "currency" "public"."investments_currency_enum" NOT NULL DEFAULT 'USD', "remarks" text, "is_active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "dealId" uuid NOT NULL, CONSTRAINT "PK_a1263853f1a4fb8b849c1c9aff4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."deals_currency_enum" AS ENUM('EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'UAH', 'RUB', 'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'DZD', 'MAD', 'UGX', 'TND', 'XOF', 'XAF', 'SCR', 'MUR', 'BWP', 'NAD', 'SDG', 'CDF', 'TZS', 'ZMW', 'SOS', 'RWF', 'ETB', 'LSL', 'SZL', 'MZN', 'GMD', 'BIF', 'MWK', 'ERN', 'LYD', 'SLL', 'CVE', 'USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'VES', 'INR', 'CNY', 'JPY', 'KRW', 'IDR', 'MYR', 'PHP', 'SGD', 'THB', 'VND')`);
        await queryRunner.query(`CREATE TYPE "public"."deals_repayment_schedule_code_enum" AS ENUM('monthly', 'annually', 'bianually', 'custom')`);
        await queryRunner.query(`CREATE TYPE "public"."deals_disbursement_schedule_code_enum" AS ENUM('monthly', 'annually', 'bianually', 'custom')`);
        await queryRunner.query(`CREATE TYPE "public"."deals_spv_code_enum" AS ENUM('default', 'custom')`);
        await queryRunner.query(`CREATE TABLE "deals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startup_name" character varying(255), "founder_firstname" character varying(255), "founder_lastname" character varying(255), "founder_email" character varying(255), "startup_website" character varying(255), "funding_amount" numeric(15,2) NOT NULL DEFAULT '0', "currency" "public"."deals_currency_enum" NOT NULL DEFAULT 'USD', "repayment_schedule_code" "public"."deals_repayment_schedule_code_enum" NOT NULL, "disbursement_schedule_code" "public"."deals_disbursement_schedule_code_enum" NOT NULL, "spv_code" "public"."deals_spv_code_enum" NOT NULL, "spv_name" character varying(255), "investors" text, "waterfall_distribution_structure" text, "angel_waterfall_distribution_structure" text, "verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "investmentInstrumentId" uuid, "startupIndustryId" uuid, CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."invitation_trackers_currency_enum" AS ENUM('EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'UAH', 'RUB', 'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'DZD', 'MAD', 'UGX', 'TND', 'XOF', 'XAF', 'SCR', 'MUR', 'BWP', 'NAD', 'SDG', 'CDF', 'TZS', 'ZMW', 'SOS', 'RWF', 'ETB', 'LSL', 'SZL', 'MZN', 'GMD', 'BIF', 'MWK', 'ERN', 'LYD', 'SLL', 'CVE', 'USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'VES', 'INR', 'CNY', 'JPY', 'KRW', 'IDR', 'MYR', 'PHP', 'SGD', 'THB', 'VND')`);
        await queryRunner.query(`CREATE TABLE "invitation_trackers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "email" character varying, "proposed_amount" numeric(15,2) NOT NULL DEFAULT '0', "funding_amount" numeric(15,2) NOT NULL DEFAULT '0', "currency" "public"."invitation_trackers_currency_enum" NOT NULL DEFAULT 'USD', "email_sent" boolean NOT NULL DEFAULT false, "user_type" character varying, "logged_in" boolean NOT NULL DEFAULT false, "user_invested_in_deal" boolean NOT NULL DEFAULT false, "user_accepted_invite" boolean NOT NULL DEFAULT false, "invite_type" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "invitedById" uuid, "dealId" uuid, CONSTRAINT "PK_5f520e6ceb6a46c2c5111165872" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a5b878f9287b41fc2f7b3e3244" ON "invitation_trackers" ("email") `);
        await queryRunner.query(`CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "continent" character varying, "dial_code" character varying, "value" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "residential_address" character varying, "address_evidence" character varying, "verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "user_id" uuid, "country_id" uuid, CONSTRAINT "REL_16aac8a9f6f9c1dd6bcb75ec02" UNIQUE ("user_id"), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_user_type_enum" AS ENUM('founder', 'syndicate_investor', 'syndicate_lead', 'admin', 'super_admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "email" character varying NOT NULL, "phone" character varying, "password" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "user_type" "public"."users_user_type_enum", "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_a000cca60bcf04454e72769949" ON "users" ("phone") `);
        await queryRunner.query(`CREATE TABLE "email_verification_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "token" character varying, "expired" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_973ceb9e119e69f5b42fbfa44ac" UNIQUE ("email"), CONSTRAINT "PK_417a095bbed21c2369a6a01ab9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_973ceb9e119e69f5b42fbfa44a" ON "email_verification_tokens" ("email") `);
        await queryRunner.query(`CREATE TABLE "reset_password_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "token" character varying, "expired" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_6feef0f35ec9c3da0f22e64da16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0c2332a549e7a685bedcf6154b" ON "reset_password_tokens" ("email") `);
        await queryRunner.query(`CREATE TABLE "identity_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_31aaa225433b9b5a86da90147ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "banks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying, "code" character varying, "country_code" character varying, "country_name" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_3975b5f684ec241e3901db62d77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "kycs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "passport" character varying, "id_image" character varying, "address" character varying, "address_evidence" character varying, "bvn" character varying, "swift_bic_code" character varying, "account_number" character varying, "account_name" character varying, "uploaded" boolean NOT NULL DEFAULT false, "verified" boolean NOT NULL DEFAULT false, "rejected" boolean NOT NULL DEFAULT false, "phone" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "id_type" uuid NOT NULL, "bank_id" uuid, CONSTRAINT "REL_bbfe1fa864841e82cff1be09e8" UNIQUE ("user_id"), CONSTRAINT "PK_6e61a5975007a8dae889765bbbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "schedule_periods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_f0e81c9b218c3551fba74793186" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_1ee4fc01d07959ee6cf7926fe3c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_6eb5c870bc909b2a6190597d3eb" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_2ab80c329115e938c396ed5d418" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_d9f515caf447e01a2a238eb0222" FOREIGN KEY ("investmentInstrumentId") REFERENCES "investment_instruments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_c8ae7832872368f9e0d96bbf50e" FOREIGN KEY ("startupIndustryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_902c25e0dea85a656465994d60e" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_49e2f48467eb7c7d0648c87d732" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_98e1ca336038167c7eb48c02582" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kycs" ADD CONSTRAINT "FK_bbfe1fa864841e82cff1be09e8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kycs" ADD CONSTRAINT "FK_10cd01dd91cb2cee5b4aa10fa0e" FOREIGN KEY ("id_type") REFERENCES "identity_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kycs" ADD CONSTRAINT "FK_fece62446bcd7ffceac2d9ed303" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`
            INSERT INTO "investment_instruments" ("id", "name", "code", "created_at", "updated_at") 
            VALUES 
                (uuid_generate_v4(), 'S.A.F.E', 'SE', NOW(), NOW()),
                (uuid_generate_v4(), 'OnAfrica PACT', 'OP', NOW(), NOW()),
                (uuid_generate_v4(), 'Others', 'OT', NOW(), NOW());
        `);


        await queryRunner.query(`
            INSERT INTO "industries" ("id", "name", "code", "created_at", "updated_at") 
            VALUES 
                (uuid_generate_v4(), 'Health Care', 'HEC', NOW(), NOW()),
                (uuid_generate_v4(), 'Finance', 'FIN', NOW(), NOW()),
                (uuid_generate_v4(), 'Technology', 'TEC', NOW(), NOW()),
                (uuid_generate_v4(), 'Education', 'EDU', NOW(), NOW()),
                (uuid_generate_v4(), 'Manufacturing', 'MFG', NOW(), NOW()),
                (uuid_generate_v4(), 'Retail', 'RTL', NOW(), NOW()),
                (uuid_generate_v4(), 'Construction', 'CST', NOW(), NOW()),
                (uuid_generate_v4(), 'Transportation', 'TRP', NOW(), NOW()),
                (uuid_generate_v4(), 'Energy', 'ENG', NOW(), NOW()),
                (uuid_generate_v4(), 'Telecommunications', 'TEL', NOW(), NOW()),
                (uuid_generate_v4(), 'Agriculture', 'AGR', NOW(), NOW()),
                (uuid_generate_v4(), 'Hospitality', 'HSP', NOW(), NOW()),
                (uuid_generate_v4(), 'Entertainment', 'ENT', NOW(), NOW()),
                (uuid_generate_v4(), 'Real Estate', 'REA', NOW(), NOW()),
                (uuid_generate_v4(), 'Legal', 'LEG', NOW(), NOW()),
                (uuid_generate_v4(), 'Marketing', 'MKT', NOW(), NOW()),
                (uuid_generate_v4(), 'Pharmaceuticals', 'PHM', NOW(), NOW()),
                (uuid_generate_v4(), 'Automotive', 'AUT', NOW(), NOW()),
                (uuid_generate_v4(), 'Aerospace', 'AER', NOW(), NOW()),
                (uuid_generate_v4(), 'Insurance', 'INS', NOW(), NOW()),
                (uuid_generate_v4(), 'Biotechnology', 'BIO', NOW(), NOW()),
                (uuid_generate_v4(), 'Mining', 'MIN', NOW(), NOW()),
                (uuid_generate_v4(), 'Waste Management', 'WMT', NOW(), NOW()),
                (uuid_generate_v4(), 'Food & Beverages', 'FNB', NOW(), NOW()),
                (uuid_generate_v4(), 'Media & Publishing', 'MED', NOW(), NOW()),
                (uuid_generate_v4(), 'Security', 'SEC', NOW(), NOW()),
                (uuid_generate_v4(), 'Sports', 'SPT', NOW(), NOW()),
                (uuid_generate_v4(), 'Fashion', 'FSH', NOW(), NOW()),
                (uuid_generate_v4(), 'Nonprofit & NGOs', 'NPO', NOW(), NOW()),
                (uuid_generate_v4(), 'Human Resources', 'HRM', NOW(), NOW()),
                (uuid_generate_v4(), 'E-commerce', 'ECM', NOW(), NOW()),
                (uuid_generate_v4(), 'Petroleum', 'PET', NOW(), NOW()),
                (uuid_generate_v4(), 'Logistics & Supply Chain', 'LSC', NOW(), NOW()),
                (uuid_generate_v4(), 'Gaming', 'GAM', NOW(), NOW()),
                (uuid_generate_v4(), 'Art & Design', 'ART', NOW(), NOW()),
                (uuid_generate_v4(), 'Marine & Shipping', 'MNS', NOW(), NOW()),
                (uuid_generate_v4(), 'Electronics', 'ELC', NOW(), NOW()),
                (uuid_generate_v4(), 'Waste Recycling', 'REC', NOW(), NOW());
    
            `);


              // Insert default values
        await queryRunner.query(`
            INSERT INTO "identity_types" ("id", "name", "created_at", "updated_at") 
            VALUES 
                (uuid_generate_v4(), 'National ID', NOW(), NOW()),
                (uuid_generate_v4(), 'International Passport', NOW(), NOW()),
                (uuid_generate_v4(), 'Driver License', NOW(), NOW());
        `);


        await queryRunner.query(`
            INSERT INTO banks (name, slug, code, country_code, country_name) VALUES
            ('GTB', 'guaranty-trust-bank', '058', 'NG', 'Nigeria'),
            ('First Bank', 'first-bank-of-nigeria', '011', 'NG', 'Nigeria'),
            ('Access', 'access-bank', '063', 'NG', 'Nigeria'),
            ('Zenith', 'zenith-bank', '057', 'NG', 'Nigeria'),
            ('UBA', 'united-bank-for-africa', '033', 'NG', 'Nigeria'),
            ('Ecobank', 'ecobank-nigeria', '050', 'NG', 'Nigeria'),
            ('Polaris', 'polaris-bank', '076', 'NG', 'Nigeria'),
            ('FCMB', 'first-city-monument-bank', '214', 'NG', 'Nigeria'),
            ('Fidelity', 'fidelity-bank', '070', 'NG', 'Nigeria'),
            ('Stanbic', 'stanbic-ibtc-bank', '221', 'NG', 'Nigeria'),
            ('Sterling', 'sterling-bank', '232', 'NG', 'Nigeria'),
            ('Union', 'union-bank-of-nigeria', '032', 'NG', 'Nigeria'),
            ('Wema', 'wema-bank', '035', 'NG', 'Nigeria'),
            ('STD CHARTD', 'standard-chartered-bank', '068', 'NG', 'Nigeria'),
            ('Citi', 'citibank-nigeria', '023', 'NG', 'Nigeria'),
            ('Unity', 'unity-bank', '215', 'NG', 'Nigeria'),
            ('Keystone', 'keystone-bank', '082', 'NG', 'Nigeria'),
            ('Heritage', 'heritage-bank', '030', 'NG', 'Nigeria'),
            ('JPMorgan Chase', 'jpmorgan-chase', '021000021', 'US', 'United States'),
            ('Bank of America', 'bank-of-america', '026009593', 'US', 'United States'),
            ('Wells Fargo', 'wells-fargo', '121000248', 'US', 'United States'),
            ('Citibank', 'citibank', '021000089', 'US', 'United States'),
            ('U.S. Bank', 'us-bank', '122105155', 'US', 'United States'),
            ('PNC Bank', 'pnc-bank', '043000096', 'US', 'United States'),
            ('Truist', 'truist', '061113415', 'US', 'United States'),
            ('Goldman Sachs', 'goldman-sachs', '051073360', 'US', 'United States'),
            ('Capital One', 'capital-one', '056073502', 'US', 'United States'),
            ('TD Bank', 'td-bank', '031101266', 'US', 'United States'),
            ('Fifth Third Bank', 'fifth-third-bank', '042000314', 'US', 'United States'),
            ('KeyBank', 'keybank', '041001039', 'US', 'United States'),
            ('Regions Bank', 'regions-bank', '062005690', 'US', 'United States'),
            ('BMO Harris', 'bmo-harris', '071025661', 'US', 'United States'),
            ('Huntington Bank', 'huntington-bank', '044000024', 'US', 'United States'),
            ('Ally Bank', 'ally-bank', '124003116', 'US', 'United States'),
            ('American Express Bank', 'american-express-bank', '124085066', 'US', 'United States'),
            ('Discover Bank', 'discover-bank', '031100649', 'US', 'United States'),
            ('Synchrony Bank', 'synchrony-bank', '021213591', 'US', 'United States'),
            ('First Republic Bank', 'first-republic-bank', '321081669', 'US', 'United States'),
            ('HSBC', 'hsbc', '400515', 'GB', 'United Kingdom'),
            ('Barclays', 'barclays', '206554', 'GB', 'United Kingdom'),
            ('Lloyds Bank', 'lloyds-bank', '309070', 'GB', 'United Kingdom'),
            ('NatWest', 'natwest', '600001', 'GB', 'United Kingdom'),
            ('Santander UK', 'santander-uk', '090126', 'GB', 'United Kingdom'),
            ('Royal Bank of Scotland', 'royal-bank-of-scotland', '830608', 'GB', 'United Kingdom'),
            ('Halifax', 'halifax', '110002', 'GB', 'United Kingdom'),
            ('TSB Bank', 'tsb-bank', '302839', 'GB', 'United Kingdom'),
            ('Metro Bank', 'metro-bank', '234004', 'GB', 'United Kingdom'),
            ('Virgin Money', 'virgin-money', '821001', 'GB', 'United Kingdom'),
            ('Monzo', 'monzo', '040004', 'GB', 'United Kingdom'),
            ('Starling Bank', 'starling-bank', '608371', 'GB', 'United Kingdom'),
            ('Revolut', 'revolut', '230573', 'GB', 'United Kingdom'),
            ('Triodos Bank', 'triodos-bank', '162750', 'GB', 'United Kingdom'),
            ('Co-operative Bank', 'co-operative-bank', '089061', 'GB', 'United Kingdom'),
            ('Clydesdale Bank', 'clydesdale-bank', '826002', 'GB', 'United Kingdom'),
            ('Yorkshire Bank', 'yorkshire-bank', '050281', 'GB', 'United Kingdom'),
            ('Handelsbanken UK', 'handelsbanken-uk', '400723', 'GB', 'United Kingdom'),
            ('Bank of Scotland', 'bank-of-scotland', '801001', 'GB', 'United Kingdom'),
            ('Tesco Bank', 'tesco-bank', '406158', 'GB', 'United Kingdom'),
            ('Equity Bank', 'equity-bank', '068', 'KE', 'Kenya'),
            ('Kenya Commercial Bank', 'kenya-commercial-bank', '011', 'KE', 'Kenya'),
            ('Co-operative Bank of Kenya', 'co-operative-bank-of-kenya', '012', 'KE', 'Kenya'),
            ('NCBA Bank', 'ncba-bank', '070', 'KE', 'Kenya'),
            ('Absa Bank Kenya', 'absa-bank-kenya', '003', 'KE', 'Kenya'),
            ('Standard Chartered Bank Kenya', 'standard-chartered-bank-kenya', '002', 'KE', 'Kenya'),
            ('Stanbic Bank Kenya', 'stanbic-bank-kenya', '31000', 'KE', 'Kenya'),
            ('I&M Bank Kenya', 'im-bank-kenya', '057', 'KE', 'Kenya'),
            ('Diamond Trust Bank', 'diamond-trust-bank', '063', 'KE', 'Kenya'),
            ('Family Bank', 'family-bank', '07000', 'KE', 'Kenya'),
            ('Bank of Africa Kenya', 'bank-of-africa-kenya', '077', 'KE', 'Kenya'),
            ('Prime Bank Kenya', 'prime-bank-kenya', '100', 'KE', 'Kenya'),
            ('Gulf African Bank', 'gulf-african-bank', '072', 'KE', 'Kenya'),
            ('HF Group', 'hf-group', '061', 'KE', 'Kenya'),
            ('Victoria Commercial Bank', 'victoria-commercial-bank', '054', 'KE', 'Kenya'),
            ('Citibank Kenya', 'citibank-kenya', '020', 'KE', 'Kenya'),
            ('National Bank of Kenya', 'national-bank-of-kenya', '008', 'KE', 'Kenya'),
            ('Sidian Bank', 'sidian-bank', '066', 'KE', 'Kenya'),
            ('ABC Bank Kenya', 'abc-bank-kenya', '045', 'KE', 'Kenya'),
            ('Development Bank of Kenya', 'development-bank-of-kenya', '040', 'KE', 'Kenya'),
            ('GCB Bank', 'gcb-bank', '040100', 'GH', 'Ghana'),
            ('Absa Bank Ghana', 'absa-bank-ghana', '040200', 'GH', 'Ghana'),
            ('Stanbic Bank Ghana', 'stanbic-bank-ghana', '040300', 'GH', 'Ghana'),
            ('Ecobank Ghana', 'ecobank-ghana', '040400', 'GH', 'Ghana'),
            ('Fidelity Bank Ghana', 'fidelity-bank-ghana', '040500', 'GH', 'Ghana'),
            ('CalBank', 'calbank', '040600', 'GH', 'Ghana'),
            ('National Investment Bank', 'national-investment-bank', '040700', 'GH', 'Ghana'),
            ('Republic Bank Ghana', 'republic-bank-ghana', '040800', 'GH', 'Ghana'),
            ('Zenith Bank Ghana', 'zenith-bank-ghana', '040900', 'GH', 'Ghana'),
            ('Access Bank Ghana', 'access-bank-ghana', '041000', 'GH', 'Ghana'),
            ('Societe Generale Ghana', 'societe-generale-ghana', '041100', 'GH', 'Ghana'),
            ('Universal Merchant Bank', 'universal-merchant-bank', '041200', 'GH', 'Ghana'),
            ('First National Bank Ghana', 'first-national-bank-ghana', '041300', 'GH', 'Ghana'),
            ('First Atlantic Bank', 'first-atlantic-bank', '041400', 'GH', 'Ghana'),
            ('Bank of Africa Ghana', 'bank-of-africa-ghana', '041500', 'GH', 'Ghana'),
            ('OmniBSIC Bank', 'omnibsic-bank', '041600', 'GH', 'Ghana'),
            ('Ghana Export-Import Bank', 'ghana-exim-bank', '041700', 'GH', 'Ghana'),
            ('ARB Apex Bank', 'arb-apex-bank', '041800', 'GH', 'Ghana'),
            ('Consolidated Bank Ghana', 'consolidated-bank-ghana', '041900', 'GH', 'Ghana'),
            ('Deutsche Bank', 'deutsche-bank', '10070000', 'DE', 'Germany'),
            ('Commerzbank', 'commerzbank', '10040000', 'DE', 'Germany'),
            ('DZ Bank', 'dz-bank', '50070010', 'DE', 'Germany'),
            ('KfW Bank', 'kfw-bank', '50020200', 'DE', 'Germany'),
            ('Unicredit Bank (HypoVereinsbank)', 'unicredit-bank', '70020270', 'DE', 'Germany'),
            ('Landesbank Baden-Württemberg', 'lbbw', '60050000', 'DE', 'Germany'),
            ('Norddeutsche Landesbank', 'nordlb', '25050000', 'DE', 'Germany'),
            ('BayernLB', 'bayernlb', '70050000', 'DE', 'Germany'),
            ('Postbank', 'postbank', '10010010', 'DE', 'Germany'),
            ('ING-DiBa', 'ing-diba', '50010517', 'DE', 'Germany'),
            ('BNP Paribas', 'bnp-paribas', '300040000', 'FR', 'France'),
            ('Société Générale', 'societe-generale', '300030000', 'FR', 'France'),
            ('Crédit Agricole', 'credit-agricole', '300020000', 'FR', 'France'),
            ('BPCE (Banque Populaire & Caisse d’Epargne)', 'bpce', '300010000', 'FR', 'France'),
            ('La Banque Postale', 'la-banque-postale', '200410000', 'FR', 'France'),
            ('Crédit Mutuel', 'credit-mutuel', '300060000', 'FR', 'France'),
            ('HSBC France', 'hsbc-france', '300560000', 'FR', 'France'),
            ('LCL (Le Crédit Lyonnais)', 'lcl', '300070000', 'FR', 'France'),
            ('BRED Banque Populaire', 'bred-banque-populaire', '300080000', 'FR', 'France'),
            ('AXA Banque', 'axa-banque', '300090000', 'FR', 'France'),
            ('Caixa Geral de Depósitos', 'caixa-geral-de-depositos', '00100000', 'PT', 'Portugal'),
            ('Banco Santander Totta', 'banco-santander-totta', '00120000', 'PT', 'Portugal'),
            ('Novo Banco', 'novo-banco', '00180000', 'PT', 'Portugal'),
            ('Banco Comercial Português (Millennium BCP)', 'banco-comercial-portugues', '00100050', 'PT', 'Portugal'),
            ('Banco BPI', 'banco-bpi', '00100060', 'PT', 'Portugal'),
            ('Montepio', 'montepio', '00100070', 'PT', 'Portugal'),
            ('Banco CTT', 'banco-ctt', '00100080', 'PT', 'Portugal'),
            ('Banco BIG', 'banco-big', '00100090', 'PT', 'Portugal'),
            ('Banco Best', 'banco-best', '00100100', 'PT', 'Portugal'),
            ('Abanca Portugal', 'abanca-portugal', '00100110', 'PT', 'Portugal'),
            ('Banka Kombëtare Tregtare', 'bkt', '21011000', 'AL', 'Albania'),
            ('Credins Bank', 'credins-bank', '21012000', 'AL', 'Albania'),
            ('Intesa Sanpaolo Bank Albania', 'intesa-sanpaolo-albania', '21013000', 'AL', 'Albania'),
            ('Raiffeisen Bank Albania', 'raiffeisen-bank-albania', '21014000', 'AL', 'Albania'),
            ('Andbank', 'andbank', '30201000', 'AD', 'Andorra'),
            ('Morabanc', 'morabanc', '30202000', 'AD', 'Andorra'),
            ('Crèdit Andorrà', 'credit-andorra', '30203000', 'AD', 'Andorra'),
            ('Erste Group Bank', 'erste-bank', '20111000', 'AT', 'Austria'),
            ('Raiffeisen Bank International', 'raiffeisen-bank-international', '20112000', 'AT', 'Austria'),
            ('BAWAG P.S.K.', 'bawag-psk', '20113000', 'AT', 'Austria'),
            ('Unicredit Bank Austria', 'unicredit-bank-austria', '20114000', 'AT', 'Austria'),
            ('Belarusbank', 'belarusbank', '30111000', 'BY', 'Belarus'),
            ('Belgazprombank', 'belgazprombank', '30112000', 'BY', 'Belarus'),
            ('Priorbank', 'priorbank', '30113000', 'BY', 'Belarus'),
            ('KBC Bank', 'kbc-bank', '20211000', 'BE', 'Belgium'),
            ('Belfius Bank', 'belfius-bank', '20212000', 'BE', 'Belgium'),
            ('ING Belgium', 'ing-belgium', '20213000', 'BE', 'Belgium'),
            ('BNP Paribas Fortis', 'bnp-paribas-fortis', '20214000', 'BE', 'Belgium'),
            ('UniCredit Bank Mostar', 'unicredit-bank-mostar', '30311000', 'BA', 'Bosnia and Herzegovina'),
            ('Raiffeisen Bank Bosnia', 'raiffeisen-bank-bosnia', '30312000', 'BA', 'Bosnia and Herzegovina'),
            ('UniCredit Bulbank', 'unicredit-bulbank', '20411000', 'BG', 'Bulgaria'),
            ('DSK Bank', 'dsk-bank', '20412000', 'BG', 'Bulgaria'),
            ('Postbank Bulgaria', 'postbank-bulgaria', '20413000', 'BG', 'Bulgaria'),
            ('Privredna banka Zagreb', 'privredna-banka-zagreb', '20511000', 'HR', 'Croatia'),
            ('Zagrebačka banka', 'zagreb-banka', '20512000', 'HR', 'Croatia'),
            ('Bank of Cyprus', 'bank-of-cyprus', '20611000', 'CY', 'Cyprus'),
            ('Hellenic Bank', 'hellenic-bank', '20612000', 'CY', 'Cyprus'),
            ('Česká spořitelna', 'ceska-sporitelna', '20711000', 'CZ', 'Czech Republic'),
            ('Komerční banka', 'komercni-banka', '20712000', 'CZ', 'Czech Republic'),
            ('Danske Bank', 'danske-bank', '20811000', 'DK', 'Denmark'),
            ('Nykredit Bank', 'nykredit-bank', '20812000', 'DK', 'Denmark'),
            ('Swedbank Estonia', 'swedbank-estonia', '20911000', 'EE', 'Estonia'),
            ('SEB Estonia', 'seb-estonia', '20912000', 'EE', 'Estonia'),
            ('OP Financial Group', 'op-financial-group', '21011000', 'FI', 'Finland'),
            ('Nordea Finland', 'nordea-finland', '21012000', 'FI', 'Finland'),
            ('National Bank of Greece', 'national-bank-of-greece', '21111000', 'GR', 'Greece'),
            ('Alpha Bank', 'alpha-bank', '21112000', 'GR', 'Greece'),
            ('OTP Bank', 'otp-bank', '21211000', 'HU', 'Hungary'),
            ('K&H Bank', 'kh-bank', '21212000', 'HU', 'Hungary'),
            ('Landsbankinn', 'landsbankinn', '21311000', 'IS', 'Iceland'),
            ('Arion Bank', 'arion-bank', '21312000', 'IS', 'Iceland'),
            ('Allied Irish Banks', 'allied-irish-banks', '21411000', 'IE', 'Ireland'),
            ('Bank of Ireland', 'bank-of-ireland', '21412000', 'IE', 'Ireland'),
            ('Intesa Sanpaolo', 'intesa-sanpaolo', '21511000', 'IT', 'Italy'),
            ('UniCredit Italy', 'unicredit-italy', '21512000', 'IT', 'Italy'),
            ('ABN AMRO', 'abn-amro', '21911000', 'NL', 'Netherlands'),
            ('ING Netherlands', 'ing-netherlands', '21912000', 'NL', 'Netherlands'),
            ('PKO Bank Polski', 'pko-bank-polski', '22111000', 'PL', 'Poland'),
            ('mBank', 'mbank', '22112000', 'PL', 'Poland'),
            ('Banca Transilvania', 'banca-transilvania', '22211000', 'RO', 'Romania'),
            ('BRD - Groupe Société Générale', 'brd-groupe-societe-generale', '22212000', 'RO', 'Romania'),
            ('Sberbank', 'sberbank', '22311000', 'RU', 'Russia'),
            ('VTB Bank', 'vtb-bank', '22312000', 'RU', 'Russia'),
            ('Banco Santander', 'banco-santander', '22511000', 'ES', 'Spain'),
            ('BBVA', 'bbva', '22512000', 'ES', 'Spain'),
            ('Swedbank', 'swedbank', '22611000', 'SE', 'Sweden'),
            ('SEB', 'seb', '22612000', 'SE', 'Sweden'),
            ('UBS', 'ubs', '22711000', 'CH', 'Switzerland'),
            ('Credit Suisse', 'credit-suisse', '22712000', 'CH', 'Switzerland'),
            ('State Bank of India', 'sbi', '30111000', 'IN', 'India'),
            ('HDFC Bank', 'hdfc-bank', '30112000', 'IN', 'India'),
            ('ICICI Bank', 'icici-bank', '30113000', 'IN', 'India'),
            ('Punjab National Bank', 'pnb', '30114000', 'IN', 'India'),
            ('Axis Bank', 'axis-bank', '30115000', 'IN', 'India'),
            ('Bank of Baroda', 'bank-of-baroda', '30116000', 'IN', 'India'),
            ('Canara Bank', 'canara-bank', '30117000', 'IN', 'India'),
            ('Union Bank of India', 'union-bank', '30118000', 'IN', 'India'),
            ('Kotak Mahindra Bank', 'kotak-mahindra-bank', '30119000', 'IN', 'India'),
            ('IndusInd Bank', 'indusind-bank', '30120000', 'IN', 'India'),
            ('IDBI Bank', 'idbi-bank', '30121000', 'IN', 'India'),
            ('Yes Bank', 'yes-bank', '30122000', 'IN', 'India'),
            ('Indian Bank', 'indian-bank', '30123000', 'IN', 'India'),
            ('Bank of India', 'bank-of-india', '30124000', 'IN', 'India'),
            ('Central Bank of India', 'central-bank-of-india', '30125000', 'IN', 'India'),
            ('Afriland First Bank', 'afriland-first-bank', '40111000', 'CM', 'Cameroon'),
            ('BGFI Bank Cameroon', 'bgfi-bank-cameroon', '40112000', 'CM', 'Cameroon'),
            ('SCB Cameroon', 'scb-cameroon', '40113000', 'CM', 'Cameroon'),
            ('Ecobank Cameroon', 'ecobank-cameroon', '40114000', 'CM', 'Cameroon'),
            ('BICEC', 'bicec', '40115000', 'CM', 'Cameroon'),
            ('UBA Cameroon', 'uba-cameroon', '40116000', 'CM', 'Cameroon'),
            ('Standard Chartered Cameroon', 'standard-chartered-cameroon', '40117000', 'CM', 'Cameroon'),
            ('Banque Atlantique Benin', 'banque-atlantique-benin', '40211000', 'BJ', 'Benin'),
            ('Ecobank Benin', 'ecobank-benin', '40212000', 'BJ', 'Benin'),
            ('UBA Benin', 'uba-benin', '40213000', 'BJ', 'Benin'),
            ('Diamond Bank Benin', 'diamond-bank-benin', '40214000', 'BJ', 'Benin'),
            ('Coris Bank Benin', 'coris-bank-benin', '40215000', 'BJ', 'Benin'),
            ('Banque Atlantique Niger', 'banque-atlantique-niger', '40311000', 'NE', 'Niger'),
            ('Ecobank Niger', 'ecobank-niger', '40312000', 'NE', 'Niger'),
            ('UBA Niger', 'uba-niger', '40313000', 'NE', 'Niger'),
            ('Sonibank', 'sonibank', '40314000', 'NE', 'Niger'),
            ('National Bank of Egypt', 'national-bank-of-egypt', '40411000', 'EG', 'Egypt'),
            ('Banque Misr', 'banque-misr', '40412000', 'EG', 'Egypt'),
            ('CIB Egypt', 'cib-egypt', '40413000', 'EG', 'Egypt'),
            ('HSBC Egypt', 'hsbc-egypt', '40414000', 'EG', 'Egypt'),
            ('Arab African International Bank', 'arab-african-international-bank', '40415000', 'EG', 'Egypt'),
            ('Standard Bank', 'standard-bank', '40511000', 'ZA', 'South Africa'),
            ('ABSA Bank', 'absa-bank', '40512000', 'ZA', 'South Africa'),
            ('Nedbank', 'nedbank', '40513000', 'ZA', 'South Africa'),
            ('First National Bank', 'first-national-bank', '40514000', 'ZA', 'South Africa'),
            ('Capitec Bank', 'capitec-bank', '40515000', 'ZA', 'South Africa'),
            ('Attijariwafa Bank', 'attijariwafa-bank', '40711000', 'MA', 'Morocco'),
            ('BMCE Bank', 'bmce-bank', '40712000', 'MA', 'Morocco'),
            ('Banque Populaire du Maroc', 'banque-populaire-maroc', '40713000', 'MA', 'Morocco'),
            ('Société Générale Maroc', 'societe-generale-maroc', '40714000', 'MA', 'Morocco'),
            ('Crédit du Maroc', 'credit-du-maroc', '40715000', 'MA', 'Morocco'),
            ('CRDB Bank', 'crdb-bank', '40811000', 'TZ', 'Tanzania'),
            ('NMB Bank Tanzania', 'nmb-bank-tanzania', '40812000', 'TZ', 'Tanzania'),
            ('Stanbic Bank Tanzania', 'stanbic-bank-tanzania', '40813000', 'TZ', 'Tanzania'),
            ('NBC Bank Tanzania', 'nbc-bank-tanzania', '40814000', 'TZ', 'Tanzania'),
            ('KCB Bank Tanzania', 'kcb-bank-tanzania', '40815000', 'TZ', 'Tanzania');
                        
        `);

        await queryRunner.query(`
            INSERT INTO "schedule_periods" ("id", "name", "code", "created_at", "updated_at") 
            VALUES 
                (uuid_generate_v4(), 'Monthly', 'monthly', NOW(), NOW()),
                (uuid_generate_v4(), 'Annually', 'annually', NOW(), NOW()),
                (uuid_generate_v4(), 'Bi-Annually', 'bianually', NOW(), NOW()),
                (uuid_generate_v4(), 'Custom', 'custom', NOW(), NOW());
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kycs" DROP CONSTRAINT "FK_fece62446bcd7ffceac2d9ed303"`);
        await queryRunner.query(`ALTER TABLE "kycs" DROP CONSTRAINT "FK_10cd01dd91cb2cee5b4aa10fa0e"`);
        await queryRunner.query(`ALTER TABLE "kycs" DROP CONSTRAINT "FK_bbfe1fa864841e82cff1be09e8b"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_98e1ca336038167c7eb48c02582"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_49e2f48467eb7c7d0648c87d732"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_902c25e0dea85a656465994d60e"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_c8ae7832872368f9e0d96bbf50e"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_d9f515caf447e01a2a238eb0222"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_2ab80c329115e938c396ed5d418"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_6eb5c870bc909b2a6190597d3eb"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_1ee4fc01d07959ee6cf7926fe3c"`);
        await queryRunner.query(`DROP TABLE "schedule_periods"`);
        await queryRunner.query(`DROP TABLE "kycs"`);
        await queryRunner.query(`DROP TABLE "banks"`);
        await queryRunner.query(`DROP TABLE "identity_types"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c2332a549e7a685bedcf6154b"`);
        await queryRunner.query(`DROP TABLE "reset_password_tokens"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_973ceb9e119e69f5b42fbfa44a"`);
        await queryRunner.query(`DROP TABLE "email_verification_tokens"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a000cca60bcf04454e72769949"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_user_type_enum"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5b878f9287b41fc2f7b3e3244"`);
        await queryRunner.query(`DROP TABLE "invitation_trackers"`);
        await queryRunner.query(`DROP TYPE "public"."invitation_trackers_currency_enum"`);
        await queryRunner.query(`DROP TABLE "deals"`);
        await queryRunner.query(`DROP TYPE "public"."deals_spv_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deals_disbursement_schedule_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deals_repayment_schedule_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deals_currency_enum"`);
        await queryRunner.query(`DROP TABLE "investments"`);
        await queryRunner.query(`DROP TYPE "public"."investments_currency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."investments_investment_status_enum"`);
        await queryRunner.query(`DROP TABLE "industries"`);
        await queryRunner.query(`DROP TABLE "investment_instruments"`);
    }

}
