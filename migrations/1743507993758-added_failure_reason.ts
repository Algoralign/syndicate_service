import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFailureReason1743507993758 implements MigrationInterface {
    name = 'AddedFailureReason1743507993758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kycs" ADD "failure_reason" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kycs" DROP COLUMN "failure_reason"`);
    }

}
