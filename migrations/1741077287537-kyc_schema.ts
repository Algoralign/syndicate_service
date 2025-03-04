import { MigrationInterface, QueryRunner } from "typeorm";

export class KycSchema1741077287537 implements MigrationInterface {
    name = 'KycSchema1741077287537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "kycs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "passport" character varying, "id_image" character varying, "address" character varying, "address_evidence" character varying, "bvn" character varying, "swift_bic_code" character varying, "account_number" character varying, "account_name" character varying, "uploaded" boolean NOT NULL DEFAULT false, "verified" boolean NOT NULL DEFAULT false, "phone" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "id_type" uuid NOT NULL, "bank_id" uuid, CONSTRAINT "REL_bbfe1fa864841e82cff1be09e8" UNIQUE ("user_id"), CONSTRAINT "PK_6e61a5975007a8dae889765bbbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "kycs" ADD CONSTRAINT "FK_bbfe1fa864841e82cff1be09e8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kycs" ADD CONSTRAINT "FK_10cd01dd91cb2cee5b4aa10fa0e" FOREIGN KEY ("id_type") REFERENCES "identity_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kycs" ADD CONSTRAINT "FK_fece62446bcd7ffceac2d9ed303" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kycs" DROP CONSTRAINT "FK_fece62446bcd7ffceac2d9ed303"`);
        await queryRunner.query(`ALTER TABLE "kycs" DROP CONSTRAINT "FK_10cd01dd91cb2cee5b4aa10fa0e"`);
        await queryRunner.query(`ALTER TABLE "kycs" DROP CONSTRAINT "FK_bbfe1fa864841e82cff1be09e8b"`);
        await queryRunner.query(`DROP TABLE "kycs"`);
    }

}
