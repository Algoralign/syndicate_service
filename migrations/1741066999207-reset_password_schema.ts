import { MigrationInterface, QueryRunner } from "typeorm";

export class ResetPasswordSchema1741066999207 implements MigrationInterface {
    name = 'ResetPasswordSchema1741066999207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reset_password_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "token" character varying, "expired" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_6feef0f35ec9c3da0f22e64da16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0c2332a549e7a685bedcf6154b" ON "reset_password_tokens" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0c2332a549e7a685bedcf6154b"`);
        await queryRunner.query(`DROP TABLE "reset_password_tokens"`);
    }

}
