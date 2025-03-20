import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomDocs1742472598651 implements MigrationInterface {
    name = 'CustomDocs1742472598651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" ADD "custom_repayment_schedule_doc" text`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "custom_disbursement_schedule_doc" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "custom_disbursement_schedule_doc"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "custom_repayment_schedule_doc"`);
    }

}
