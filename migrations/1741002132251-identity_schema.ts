import { MigrationInterface, QueryRunner } from "typeorm";

export class IdentitySchema1741002132251 implements MigrationInterface {
    name = 'IdentitySchema1741002132251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "identity_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_31aaa225433b9b5a86da90147ae" PRIMARY KEY ("id"))`);
        // Insert default values
        await queryRunner.query(`
            INSERT INTO "identity_types" ("id", "name", "created_at", "updated_at") 
            VALUES 
                (uuid_generate_v4(), 'National ID', NOW(), NOW()),
                (uuid_generate_v4(), 'International Passport', NOW(), NOW()),
                (uuid_generate_v4(), 'Driver License', NOW(), NOW());
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "identity_types"`);
    }

}
