import { MigrationInterface, QueryRunner } from "typeorm";

export class TrackUpload1742049492702 implements MigrationInterface {
    name = 'TrackUpload1742049492702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "receipt_uploaded" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "receipt_uploaded"`);
    }

}
