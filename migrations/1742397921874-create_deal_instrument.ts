import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDealInstrument1742397921874 implements MigrationInterface {
    name = 'CreateDealInstrument1742397921874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" ADD "investmentInstrumentId" uuid`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_d9f515caf447e01a2a238eb0222" FOREIGN KEY ("investmentInstrumentId") REFERENCES "investment_instruments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_d9f515caf447e01a2a238eb0222"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "investmentInstrumentId"`);
    }

}
