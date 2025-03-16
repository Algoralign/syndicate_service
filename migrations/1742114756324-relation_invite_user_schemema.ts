import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationInviteUserSchemema1742114756324 implements MigrationInterface {
    name = 'RelationInviteUserSchemema1742114756324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_ab2ad9bfdb45d2897a9cd62cffb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_ab2ad9bfdb45d2897a9cd62cffb"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "user_id"`);
    }

}
