import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1741868881787 implements MigrationInterface {
    name = 'InitialMigration1741868881787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "industries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_f1626dcb2d58142d7dfcca7b8d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."investments_investment_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TYPE "public"."investments_currency_enum" AS ENUM('EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'UAH', 'RUB', 'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'DZD', 'MAD', 'UGX', 'TND', 'XOF', 'XAF', 'SCR', 'MUR', 'BWP', 'NAD', 'SDG', 'CDF', 'TZS', 'ZMW', 'SOS', 'RWF', 'ETB', 'LSL', 'SZL', 'MZN', 'GMD', 'BIF', 'MWK', 'ERN', 'LYD', 'SLL', 'CVE', 'USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'VES', 'INR', 'CNY', 'JPY', 'KRW', 'IDR', 'MYR', 'PHP', 'SGD', 'THB', 'VND')`);
        await queryRunner.query(`CREATE TABLE "investments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "investment_amount" numeric(15,2) NOT NULL DEFAULT '0', "proposed_amount" numeric(15,2) NOT NULL DEFAULT '0', "actual_disbursed_amount" numeric(15,2), "disbursement_date" date, "investment_status" "public"."investments_investment_status_enum" NOT NULL DEFAULT 'PENDING', "currency" "public"."investments_currency_enum" NOT NULL DEFAULT 'USD', "remarks" text, "is_active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "dealId" uuid NOT NULL, CONSTRAINT "PK_a1263853f1a4fb8b849c1c9aff4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "investment_instruments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_86e82ba26d03f052f9d17165a85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "syndicates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "deal_id" uuid, "investmentInstrumentId" uuid, CONSTRAINT "REL_c069ad45adb8ee74362ab10cdf" UNIQUE ("deal_id"), CONSTRAINT "PK_82297fa598f01e7de64bef4cf45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."deals_currency_enum" AS ENUM('EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'UAH', 'RUB', 'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'DZD', 'MAD', 'UGX', 'TND', 'XOF', 'XAF', 'SCR', 'MUR', 'BWP', 'NAD', 'SDG', 'CDF', 'TZS', 'ZMW', 'SOS', 'RWF', 'ETB', 'LSL', 'SZL', 'MZN', 'GMD', 'BIF', 'MWK', 'ERN', 'LYD', 'SLL', 'CVE', 'USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'VES', 'INR', 'CNY', 'JPY', 'KRW', 'IDR', 'MYR', 'PHP', 'SGD', 'THB', 'VND')`);
        await queryRunner.query(`CREATE TYPE "public"."deals_repayment_schedule_code_enum" AS ENUM('monthly', 'annually', 'bianually', 'custom')`);
        await queryRunner.query(`CREATE TYPE "public"."deals_disbursement_schedule_code_enum" AS ENUM('monthly', 'annually', 'bianually', 'custom')`);
        await queryRunner.query(`CREATE TYPE "public"."deals_spv_code_enum" AS ENUM('default', 'custom')`);
        await queryRunner.query(`CREATE TABLE "deals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startup_name" character varying(255), "founder_firstname" character varying(255), "founder_lastname" character varying(255), "founder_email" character varying(255), "startup_website" character varying(255), "funding_amount" numeric(15,2) NOT NULL DEFAULT '0', "currency" "public"."deals_currency_enum" NOT NULL DEFAULT 'USD', "repayment_schedule_code" "public"."deals_repayment_schedule_code_enum" NOT NULL, "disbursement_schedule_code" "public"."deals_disbursement_schedule_code_enum" NOT NULL, "spv_code" "public"."deals_spv_code_enum" NOT NULL, "spv_name" character varying(255), "waterfall_distribution_structure" text, "angel_waterfall_distribution_structure" text, "verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "startupIndustryId" uuid, "syndicate_id" uuid, CONSTRAINT "REL_4bee969e303d410fb5fc7729cc" UNIQUE ("syndicate_id"), CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "system_receiving_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_name" character varying, "account_number_iban" character varying, "bank_name" character varying, "currency" character varying, "swift_bic_code" character varying, "routing_number" character varying, "sort_code" character varying, "address" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_3657388cc51e499d624d663a68b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_receipts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "recipt_img" character varying, "approved" boolean NOT NULL DEFAULT false, "rejected" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "systemReceivingAccountId" uuid, CONSTRAINT "PK_42242bb7e01c7d075b35bd13fe0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."invitation_trackers_currency_enum" AS ENUM('EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'UAH', 'RUB', 'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'DZD', 'MAD', 'UGX', 'TND', 'XOF', 'XAF', 'SCR', 'MUR', 'BWP', 'NAD', 'SDG', 'CDF', 'TZS', 'ZMW', 'SOS', 'RWF', 'ETB', 'LSL', 'SZL', 'MZN', 'GMD', 'BIF', 'MWK', 'ERN', 'LYD', 'SLL', 'CVE', 'USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'VES', 'INR', 'CNY', 'JPY', 'KRW', 'IDR', 'MYR', 'PHP', 'SGD', 'THB', 'VND')`);
        await queryRunner.query(`CREATE TABLE "invitation_trackers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "email" character varying, "proposed_amount" numeric(15,2) NOT NULL DEFAULT '0', "funding_amount" numeric(15,2) NOT NULL DEFAULT '0', "currency" "public"."invitation_trackers_currency_enum" NOT NULL DEFAULT 'USD', "email_sent" boolean NOT NULL DEFAULT false, "user_type" character varying, "logged_in" boolean NOT NULL DEFAULT false, "user_invested_in_deal" boolean NOT NULL DEFAULT false, "user_accepted_invite" boolean NOT NULL DEFAULT false, "invite_type" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "invitedById" uuid, "dealId" uuid, "payment_receipt_id" uuid, CONSTRAINT "REL_27d1cbfa412e3d1d73089fad3c" UNIQUE ("payment_receipt_id"), CONSTRAINT "PK_5f520e6ceb6a46c2c5111165872" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a5b878f9287b41fc2f7b3e3244" ON "invitation_trackers" ("email") `);
        await queryRunner.query(`CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "continent" character varying, "dial_code" character varying, "value" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "residential_address" character varying, "address_evidence" character varying, "verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "user_id" uuid, "country_id" uuid, CONSTRAINT "REL_16aac8a9f6f9c1dd6bcb75ec02" UNIQUE ("user_id"), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_user_type_enum" AS ENUM('founder', 'syndicate_investor', 'syndicate_lead', 'admin', 'super_admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "email" character varying NOT NULL, "phone" character varying, "password" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "user_type" "public"."users_user_type_enum", "invite_type" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`ALTER TABLE "syndicates" ADD CONSTRAINT "FK_25896861461d093f8e3d5b21bdc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "syndicates" ADD CONSTRAINT "FK_c069ad45adb8ee74362ab10cdf0" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "syndicates" ADD CONSTRAINT "FK_fd34beae795c1a208a6bdb8e858" FOREIGN KEY ("investmentInstrumentId") REFERENCES "investment_instruments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_2ab80c329115e938c396ed5d418" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_c8ae7832872368f9e0d96bbf50e" FOREIGN KEY ("startupIndustryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_4bee969e303d410fb5fc7729ccf" FOREIGN KEY ("syndicate_id") REFERENCES "syndicates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD CONSTRAINT "FK_09447ed8b8a95a9b4d45f4d812c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD CONSTRAINT "FK_17534dfcb1d7d511c692420667a" FOREIGN KEY ("systemReceivingAccountId") REFERENCES "system_receiving_accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_902c25e0dea85a656465994d60e" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_49e2f48467eb7c7d0648c87d732" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_27d1cbfa412e3d1d73089fad3cc" FOREIGN KEY ("payment_receipt_id") REFERENCES "payment_receipts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_98e1ca336038167c7eb48c02582" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kycs" ADD CONSTRAINT "FK_bbfe1fa864841e82cff1be09e8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kycs" ADD CONSTRAINT "FK_10cd01dd91cb2cee5b4aa10fa0e" FOREIGN KEY ("id_type") REFERENCES "identity_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kycs" ADD CONSTRAINT "FK_fece62446bcd7ffceac2d9ed303" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kycs" DROP CONSTRAINT "FK_fece62446bcd7ffceac2d9ed303"`);
        await queryRunner.query(`ALTER TABLE "kycs" DROP CONSTRAINT "FK_10cd01dd91cb2cee5b4aa10fa0e"`);
        await queryRunner.query(`ALTER TABLE "kycs" DROP CONSTRAINT "FK_bbfe1fa864841e82cff1be09e8b"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_98e1ca336038167c7eb48c02582"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_27d1cbfa412e3d1d73089fad3cc"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_49e2f48467eb7c7d0648c87d732"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_902c25e0dea85a656465994d60e"`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP CONSTRAINT "FK_17534dfcb1d7d511c692420667a"`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP CONSTRAINT "FK_09447ed8b8a95a9b4d45f4d812c"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_4bee969e303d410fb5fc7729ccf"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_c8ae7832872368f9e0d96bbf50e"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_2ab80c329115e938c396ed5d418"`);
        await queryRunner.query(`ALTER TABLE "syndicates" DROP CONSTRAINT "FK_fd34beae795c1a208a6bdb8e858"`);
        await queryRunner.query(`ALTER TABLE "syndicates" DROP CONSTRAINT "FK_c069ad45adb8ee74362ab10cdf0"`);
        await queryRunner.query(`ALTER TABLE "syndicates" DROP CONSTRAINT "FK_25896861461d093f8e3d5b21bdc"`);
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
        await queryRunner.query(`DROP TABLE "payment_receipts"`);
        await queryRunner.query(`DROP TABLE "system_receiving_accounts"`);
        await queryRunner.query(`DROP TABLE "deals"`);
        await queryRunner.query(`DROP TYPE "public"."deals_spv_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deals_disbursement_schedule_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deals_repayment_schedule_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deals_currency_enum"`);
        await queryRunner.query(`DROP TABLE "syndicates"`);
        await queryRunner.query(`DROP TABLE "investment_instruments"`);
        await queryRunner.query(`DROP TABLE "investments"`);
        await queryRunner.query(`DROP TYPE "public"."investments_currency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."investments_investment_status_enum"`);
        await queryRunner.query(`DROP TABLE "industries"`);
    }

}
