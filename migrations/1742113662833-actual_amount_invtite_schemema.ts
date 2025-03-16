import { MigrationInterface, QueryRunner } from "typeorm";

export class ActualAmountInvtiteSchemema1742113662833 implements MigrationInterface {
    name = 'ActualAmountInvtiteSchemema1742113662833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "actual_amount_invested" numeric(15,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "actual_amount_invested"`);
    }

}
