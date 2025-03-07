import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRejectedSchemaTokyc1741337757802 implements MigrationInterface {
    name = 'AddedRejectedSchemaTokyc1741337757802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kycs" ADD "rejected" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kycs" DROP COLUMN "rejected"`);
    }

}
