import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsertypeSchema1741285093080 implements MigrationInterface {
    name = 'CreateUsertypeSchema1741285093080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_user_type_enum" AS ENUM('others', 'admin', 'super_admin')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_type" "public"."users_user_type_enum" NOT NULL DEFAULT 'others'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_type"`);
        await queryRunner.query(`DROP TYPE "public"."users_user_type_enum"`);
    }

}
