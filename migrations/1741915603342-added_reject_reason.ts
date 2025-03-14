import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRejectReason1741915603342 implements MigrationInterface {
    name = 'AddedRejectReason1741915603342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD "reject_reason" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP COLUMN "reject_reason"`);
    }

}
