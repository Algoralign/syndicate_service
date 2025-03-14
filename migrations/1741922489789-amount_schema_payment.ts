import { MigrationInterface, QueryRunner } from "typeorm";

export class AmountSchemaPayment1741922489789 implements MigrationInterface {
    name = 'AmountSchemaPayment1741922489789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD "investment_amount" numeric(15,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP COLUMN "investment_amount"`);
    }

}
