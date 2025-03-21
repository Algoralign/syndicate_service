import { MigrationInterface, QueryRunner } from "typeorm";

export class CodesNullable1742578516579 implements MigrationInterface {
    name = 'CodesNullable1742578516579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" ALTER COLUMN "repayment_schedule_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deals" ALTER COLUMN "disbursement_schedule_code" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" ALTER COLUMN "disbursement_schedule_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deals" ALTER COLUMN "repayment_schedule_code" SET NOT NULL`);
    }

}
