import { MigrationInterface, QueryRunner } from "typeorm";

export class DealAdjustment1742465454593 implements MigrationInterface {
    name = 'DealAdjustment1742465454593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD "investment_fee" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "investments" ADD "investment_fee" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "spv_custom_doc" text`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "ticket_size" integer`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "investment_fee" numeric(15,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "investment_fee"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "ticket_size"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "spv_custom_doc"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP COLUMN "investment_fee"`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP COLUMN "investment_fee"`);
    }

}
