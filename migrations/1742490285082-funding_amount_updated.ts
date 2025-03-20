import { MigrationInterface, QueryRunner } from "typeorm";

export class FundingAmountUpdated1742490285082 implements MigrationInterface {
    name = 'FundingAmountUpdated1742490285082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" RENAME COLUMN "funding_amount" TO "allocation_size"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "funding_amount"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "investment_fee"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "investment_fee_on_proposed_amount" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "investment_fee_on_actual_amount_invested" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "allocation_size" numeric(15,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "allocation_size"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "investment_fee_on_actual_amount_invested"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "investment_fee_on_proposed_amount"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "investment_fee" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "funding_amount" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "deals" RENAME COLUMN "allocation_size" TO "funding_amount"`);
    }

}
