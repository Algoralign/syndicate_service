import { MigrationInterface, QueryRunner } from "typeorm";

export class ScheduleSchema1741116352765 implements MigrationInterface {
    name = 'ScheduleSchema1741116352765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "schedule_periods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_f0e81c9b218c3551fba74793186" PRIMARY KEY ("id"))`);

        await queryRunner.query(`
            INSERT INTO "schedule_periods" ("id", "name", "code", "created_at", "updated_at") 
            VALUES 
                (uuid_generate_v4(), 'Monthly', 'monthly', NOW(), NOW()),
                (uuid_generate_v4(), 'Annually', 'annually', NOW(), NOW()),
                (uuid_generate_v4(), 'Bi-Annually', 'bianually', NOW(), NOW()),
                (uuid_generate_v4(), 'Custom', 'custom', NOW(), NOW());
        `);
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "schedule_periods"`);
    }

}
