import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentInvite1742041843743 implements MigrationInterface {
    name = 'PaymentInvite1742041843743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ADD "paymentReceiptId" uuid`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "UQ_40871c61472ef06b6aa4b612d12" UNIQUE ("paymentReceiptId")`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_40871c61472ef06b6aa4b612d12" FOREIGN KEY ("paymentReceiptId") REFERENCES "payment_receipts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_40871c61472ef06b6aa4b612d12"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "UQ_40871c61472ef06b6aa4b612d12"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP COLUMN "paymentReceiptId"`);
    }

}
