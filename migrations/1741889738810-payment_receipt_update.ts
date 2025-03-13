import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentReceiptUpdate1741889738810 implements MigrationInterface {
    name = 'PaymentReceiptUpdate1741889738810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD "dealId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD "syndicateId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD CONSTRAINT "FK_5448687c2c39c4555a378dad541" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD CONSTRAINT "FK_6f581256b13daced941e8609719" FOREIGN KEY ("syndicateId") REFERENCES "syndicates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP CONSTRAINT "FK_6f581256b13daced941e8609719"`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP CONSTRAINT "FK_5448687c2c39c4555a378dad541"`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP COLUMN "syndicateId"`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP COLUMN "dealId"`);
    }

}
