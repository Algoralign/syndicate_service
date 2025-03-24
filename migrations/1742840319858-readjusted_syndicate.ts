import { MigrationInterface, QueryRunner } from "typeorm";

export class ReadjustedSyndicate1742840319858 implements MigrationInterface {
    name = 'ReadjustedSyndicate1742840319858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "syndicates" DROP CONSTRAINT "FK_fd34beae795c1a208a6bdb8e858"`);
        await queryRunner.query(`ALTER TABLE "syndicates" DROP COLUMN "ticket_size"`);
        await queryRunner.query(`ALTER TABLE "syndicates" DROP COLUMN "percentage_fee"`);
        await queryRunner.query(`ALTER TABLE "syndicates" DROP COLUMN "investmentInstrumentId"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "percentage_fee" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "percentage_fee"`);
        await queryRunner.query(`ALTER TABLE "syndicates" ADD "investmentInstrumentId" uuid`);
        await queryRunner.query(`ALTER TABLE "syndicates" ADD "percentage_fee" integer`);
        await queryRunner.query(`ALTER TABLE "syndicates" ADD "ticket_size" integer`);
        await queryRunner.query(`ALTER TABLE "syndicates" ADD CONSTRAINT "FK_fd34beae795c1a208a6bdb8e858" FOREIGN KEY ("investmentInstrumentId") REFERENCES "investment_instruments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
