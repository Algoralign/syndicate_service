import { MigrationInterface, QueryRunner } from "typeorm";

export class InvestmentDealSchema1741268564420 implements MigrationInterface {
    name = 'InvestmentDealSchema1741268564420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."investments_investment_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TYPE "public"."investments_currency_enum" AS ENUM('EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'UAH', 'RUB', 'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'DZD', 'MAD', 'UGX', 'TND', 'XOF', 'XAF', 'SCR', 'MUR', 'BWP', 'NAD', 'SDG', 'CDF', 'TZS', 'ZMW', 'SOS', 'RWF', 'ETB', 'LSL', 'SZL', 'MZN', 'GMD', 'BIF', 'MWK', 'ERN', 'LYD', 'SLL', 'CVE', 'USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'VES', 'INR', 'CNY', 'JPY', 'KRW', 'IDR', 'MYR', 'PHP', 'SGD', 'THB', 'VND')`);
        await queryRunner.query(`CREATE TABLE "investments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "investment_amount" numeric(15,2) NOT NULL DEFAULT '0', "proposed_amount" numeric(15,2) NOT NULL DEFAULT '0', "actual_disbursed_amount" numeric(15,2), "disbursement_date" date, "investment_status" "public"."investments_investment_status_enum" NOT NULL DEFAULT 'PENDING', "currency" "public"."investments_currency_enum" NOT NULL DEFAULT 'USD', "remarks" text, "is_active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "dealId" uuid NOT NULL, CONSTRAINT "PK_a1263853f1a4fb8b849c1c9aff4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."deals_currency_enum" AS ENUM('EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'UAH', 'RUB', 'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'DZD', 'MAD', 'UGX', 'TND', 'XOF', 'XAF', 'SCR', 'MUR', 'BWP', 'NAD', 'SDG', 'CDF', 'TZS', 'ZMW', 'SOS', 'RWF', 'ETB', 'LSL', 'SZL', 'MZN', 'GMD', 'BIF', 'MWK', 'ERN', 'LYD', 'SLL', 'CVE', 'USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'VES', 'INR', 'CNY', 'JPY', 'KRW', 'IDR', 'MYR', 'PHP', 'SGD', 'THB', 'VND')`);
        await queryRunner.query(`CREATE TYPE "public"."deals_repayment_schedule_code_enum" AS ENUM('monthly', 'annually', 'bianually', 'custom')`);
        await queryRunner.query(`CREATE TYPE "public"."deals_disbursement_schedule_code_enum" AS ENUM('monthly', 'annually', 'bianually', 'custom')`);
        await queryRunner.query(`CREATE TYPE "public"."deals_spv_code_enum" AS ENUM('default', 'custom')`);
        await queryRunner.query(`CREATE TABLE "deals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startup_name" character varying(255), "founder_firstname" character varying(255), "founder_lastname" character varying(255), "founder_email" character varying(255), "startup_website" character varying(255), "funding_amount" numeric(15,2) NOT NULL DEFAULT '0', "currency" "public"."deals_currency_enum" NOT NULL DEFAULT 'USD', "repayment_schedule_code" "public"."deals_repayment_schedule_code_enum" NOT NULL, "disbursement_schedule_code" "public"."deals_disbursement_schedule_code_enum" NOT NULL, "spv_code" "public"."deals_spv_code_enum" NOT NULL, "spv_name" character varying(255), "investors" text, "waterfall_distribution_structure" text, "angel_waterfall_distribution_structure" text, "verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "investmentInstrumentId" uuid, "startupIndustryId" uuid, CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invitation_trackers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email_sent" boolean NOT NULL DEFAULT false, "user_type" character varying, "logged_in" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "invitedById" uuid, "inviteeId" uuid, "dealId" uuid, CONSTRAINT "PK_5f520e6ceb6a46c2c5111165872" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_1ee4fc01d07959ee6cf7926fe3c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_6eb5c870bc909b2a6190597d3eb" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_2ab80c329115e938c396ed5d418" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_d9f515caf447e01a2a238eb0222" FOREIGN KEY ("investmentInstrumentId") REFERENCES "investment_instruments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_c8ae7832872368f9e0d96bbf50e" FOREIGN KEY ("startupIndustryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_902c25e0dea85a656465994d60e" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_c3fbfaa3e976a0db4f426263945" FOREIGN KEY ("inviteeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_49e2f48467eb7c7d0648c87d732" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_49e2f48467eb7c7d0648c87d732"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_c3fbfaa3e976a0db4f426263945"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_902c25e0dea85a656465994d60e"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_c8ae7832872368f9e0d96bbf50e"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_d9f515caf447e01a2a238eb0222"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_2ab80c329115e938c396ed5d418"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_6eb5c870bc909b2a6190597d3eb"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_1ee4fc01d07959ee6cf7926fe3c"`);
        await queryRunner.query(`DROP TABLE "invitation_trackers"`);
        await queryRunner.query(`DROP TABLE "deals"`);
        await queryRunner.query(`DROP TYPE "public"."deals_spv_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deals_disbursement_schedule_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deals_repayment_schedule_code_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deals_currency_enum"`);
        await queryRunner.query(`DROP TABLE "investments"`);
        await queryRunner.query(`DROP TYPE "public"."investments_currency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."investments_investment_status_enum"`);
    }

}
