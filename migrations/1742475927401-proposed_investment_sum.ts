import { MigrationInterface, QueryRunner } from "typeorm";

export class ProposedInvestmentSum1742475927401 implements MigrationInterface {
    name = 'ProposedInvestmentSum1742475927401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "proposed_amount_plus_investment_fee" numeric(15,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "proposed_amount_plus_investment_fee"`);
    }

}
