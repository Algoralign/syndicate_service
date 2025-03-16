import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionEntity1742126662276 implements MigrationInterface {
    name = 'TransactionEntity1742126662276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('investment', 'withdrawal', 'refund')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_currency_enum" AS ENUM('EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'UAH', 'RUB', 'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'DZD', 'MAD', 'UGX', 'TND', 'XOF', 'XAF', 'SCR', 'MUR', 'BWP', 'NAD', 'SDG', 'CDF', 'TZS', 'ZMW', 'SOS', 'RWF', 'ETB', 'LSL', 'SZL', 'MZN', 'GMD', 'BIF', 'MWK', 'ERN', 'LYD', 'SLL', 'CVE', 'USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'VES', 'INR', 'CNY', 'JPY', 'KRW', 'IDR', 'MYR', 'PHP', 'SGD', 'THB', 'VND')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."transactions_type_enum" NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending', "amount" numeric(15,2) NOT NULL, "currency" "public"."transactions_currency_enum" NOT NULL DEFAULT 'USD', "reference" character varying, "payment_gateway" character varying, "bank_name" character varying, "receipt_url" character varying, "initiated_by" character varying, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "deal_id" uuid, "syndicate_id" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_f87801cc8dfed7930dcab529879" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_02fee9578deb7d0c7e73845d93c" FOREIGN KEY ("syndicate_id") REFERENCES "syndicates"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_02fee9578deb7d0c7e73845d93c"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_f87801cc8dfed7930dcab529879"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_currency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }

}
