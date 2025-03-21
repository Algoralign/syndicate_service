import { MigrationInterface, QueryRunner } from "typeorm";

export class InviteTracker1742577128430 implements MigrationInterface {
    name = 'InviteTracker1742577128430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "invite_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "invite_url"`);
    }

}
