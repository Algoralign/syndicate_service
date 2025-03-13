import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedSyndicateRel1741882541447 implements MigrationInterface {
    name = 'UpdatedSyndicateRel1741882541447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investments" ADD "syndicateId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "syndicateId" uuid`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_5cb308dd334681efab7da99fa63" FOREIGN KEY ("syndicateId") REFERENCES "syndicates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_21accd3b848a7c1146b8906935e" FOREIGN KEY ("syndicateId") REFERENCES "syndicates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_21accd3b848a7c1146b8906935e"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_5cb308dd334681efab7da99fa63"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "syndicateId"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP COLUMN "syndicateId"`);
    }

}
