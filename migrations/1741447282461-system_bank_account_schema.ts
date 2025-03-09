import { MigrationInterface, QueryRunner } from "typeorm";

export class SystemBankAccountSchema1741447282461 implements MigrationInterface {
    name = 'SystemBankAccountSchema1741447282461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "system_receiving_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_name" character varying, "account_number_iban" character varying, "bank_name" character varying, "currency" character varying, "swift_bic_code" character varying, "routing_number" character varying, "sort_code" character varying, "address" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_3657388cc51e499d624d663a68b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_receipts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "recipt_img" character varying, "approved" boolean NOT NULL DEFAULT false, "rejected" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "systemReceivingAccountId" uuid, CONSTRAINT "PK_42242bb7e01c7d075b35bd13fe0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD "payment_receipt_id" uuid`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "UQ_27d1cbfa412e3d1d73089fad3cc" UNIQUE ("payment_receipt_id")`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD CONSTRAINT "FK_09447ed8b8a95a9b4d45f4d812c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" ADD CONSTRAINT "FK_17534dfcb1d7d511c692420667a" FOREIGN KEY ("systemReceivingAccountId") REFERENCES "system_receiving_accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" ADD CONSTRAINT "FK_27d1cbfa412e3d1d73089fad3cc" FOREIGN KEY ("payment_receipt_id") REFERENCES "payment_receipts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`
            INSERT INTO "system_receiving_accounts" 
            ("id", "account_name", "account_number_iban", "bank_name", "currency", "swift_bic_code", "routing_number", "sort_code", "address", "created_at", "updated_at")
            VALUES 
                (uuid_generate_v4(), 'Account 1', 'GB29NWBK60161331926819', 'Bank A', 'USD', 'SWIFT1234', '123456789', '112233', '123 Bank St', NOW(), NOW()),
                (uuid_generate_v4(), 'Account 2', 'DE89370400440532013000', 'Bank B', 'EUR', 'SWIFT5678', '987654321', '445566', '456 Bank Rd', NOW(), NOW()),
                (uuid_generate_v4(), 'Account 3', 'FR1420041010050500013M02606', 'Bank C', 'GBP', 'SWIFT9876', '567890123', '778899', '789 Bank Ave', NOW(), NOW()),
                (uuid_generate_v4(), 'Account 4', 'IT60X0542811101000000123456', 'Bank D', 'JPY', 'SWIFT4321', '234567890', '334455', '101 Bank Blvd', NOW(), NOW()),
                (uuid_generate_v4(), 'Account 5', 'NG1234567890', 'Bank E', 'NGN', 'SWIFT6543', '678901234', '556677', '101 Lagos St', NOW(), NOW()),
                (uuid_generate_v4(), 'Account 6', 'NG9876543210', 'Bank F', 'GBP', 'SWIFT1357', '234567890', '123456', '200 Abuja Ave', NOW(), NOW());
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "FK_27d1cbfa412e3d1d73089fad3cc"`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP CONSTRAINT "FK_17534dfcb1d7d511c692420667a"`);
        await queryRunner.query(`ALTER TABLE "payment_receipts" DROP CONSTRAINT "FK_09447ed8b8a95a9b4d45f4d812c"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP CONSTRAINT "UQ_27d1cbfa412e3d1d73089fad3cc"`);
        await queryRunner.query(`ALTER TABLE "invitation_trackers" DROP COLUMN "payment_receipt_id"`);
        await queryRunner.query(`DROP TABLE "payment_receipts"`);
        await queryRunner.query(`DROP TABLE "system_receiving_accounts"`);
    }

}
