import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1741343802168 implements MigrationInterface {
    name = 'InitialSchema1741343802168'

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
        await queryRunner.query(`CREATE TABLE "invitation_trackers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "email" character varying, "proposed_amount" numeric(15,2) NOT NULL DEFAULT '0', "funding_amount" numeric(15,2) NOT NULL DEFAULT '0', "currency" "public"."invitation_trackers_currency_enum" NOT NULL DEFAULT 'USD', "email_sent" boolean NOT NULL DEFAULT false, "user_type" character varying, "logged_in" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "invitedById" uuid, "dealId" uuid, CONSTRAINT "PK_5f520e6ceb6a46c2c5111165872" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a5b878f9287b41fc2f7b3e3244" ON "invitation_trackers" ("email") `);
        await queryRunner.query(`CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "continent" character varying, "dial_code" character varying, "value" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "residential_address" character varying, "address_evidence" character varying, "verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "user_id" uuid, "country_id" uuid, CONSTRAINT "REL_16aac8a9f6f9c1dd6bcb75ec02" UNIQUE ("user_id"), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_user_type_enum" AS ENUM('founder', 'syndicate', 'admin', 'super_admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "email" character varying NOT NULL, "phone" character varying, "password" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "user_type" "public"."users_user_type_enum" NOT NULL DEFAULT 'syndicate', "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_a000cca60bcf04454e72769949" ON "users" ("phone") `);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_1ee4fc01d07959ee6cf7926fe3c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_6eb5c870bc909b2a6190597d3eb" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_2ab80c329115e938c396ed5d418" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_d9f515caf447e01a2a238eb0222" FOREIGN KEY ("investmentInstrumentId") REFERENCES "investment_instruments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_c8ae7832872368f9e0d96bbf50e" FOREIGN KEY ("startupIndustryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_902c25e0dea85a656465994d60e" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_49e2f48467eb7c7d0648c87d732" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_98e1ca336038167c7eb48c02582" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

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

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_98e1ca336038167c7eb48c02582"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_49e2f48467eb7c7d0648c87d732"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_902c25e0dea85a656465994d60e"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_c8ae7832872368f9e0d96bbf50e"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_d9f515caf447e01a2a238eb0222"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_2ab80c329115e938c396ed5d418"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_6eb5c870bc909b2a6190597d3eb"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_1ee4fc01d07959ee6cf7926fe3c"`);
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
