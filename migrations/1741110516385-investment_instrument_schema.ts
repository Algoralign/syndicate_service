import { MigrationInterface, QueryRunner } from "typeorm";

export class InvestmentInstrumentSchema1741110516385 implements MigrationInterface {
    name = 'InvestmentInstrumentSchema1741110516385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "investment_instruments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_86e82ba26d03f052f9d17165a85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`
            INSERT INTO "investment_instruments" ("id", "name", "code", "created_at", "updated_at") 
            VALUES 
                (uuid_generate_v4(), 'S.A.F.E', 'SE', NOW(), NOW()),
                (uuid_generate_v4(), 'OnAfrica PACT', 'OP', NOW(), NOW()),
                (uuid_generate_v4(), 'Others', 'OT', NOW(), NOW());
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "investment_instruments"`);
    }

}
