import { MigrationInterface, QueryRunner } from "typeorm";

export class SyndicateColumns1742387931642 implements MigrationInterface {
    name = 'SyndicateColumns1742387931642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "syndicates" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "syndicates" ADD "percentage_fee" integer`);
        await queryRunner.query(`ALTER TABLE "syndicates" ADD "syndicate_website" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "syndicates" DROP COLUMN "syndicate_website"`);
        await queryRunner.query(`ALTER TABLE "syndicates" DROP COLUMN "percentage_fee"`);
        await queryRunner.query(`ALTER TABLE "syndicates" DROP COLUMN "description"`);
    }

}
