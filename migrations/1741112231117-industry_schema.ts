import { MigrationInterface, QueryRunner } from "typeorm";

export class IndustrySchema1741112231117 implements MigrationInterface {
    name = 'IndustrySchema1741112231117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "industries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_f1626dcb2d58142d7dfcca7b8d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`
        INSERT INTO "industries" ("id", "name", "code", "created_at", "updated_at") 
        VALUES 
            (uuid_generate_v4(), 'Health Care', 'HEC', NOW(), NOW()),
            (uuid_generate_v4(), 'Finance', 'FIN', NOW(), NOW()),
            (uuid_generate_v4(), 'Technology', 'TEC', NOW(), NOW()),
            (uuid_generate_v4(), 'Education', 'EDU', NOW(), NOW()),
            (uuid_generate_v4(), 'Manufacturing', 'MFG', NOW(), NOW()),
            (uuid_generate_v4(), 'Retail', 'RTL', NOW(), NOW()),
            (uuid_generate_v4(), 'Construction', 'CST', NOW(), NOW()),
            (uuid_generate_v4(), 'Transportation', 'TRP', NOW(), NOW()),
            (uuid_generate_v4(), 'Energy', 'ENG', NOW(), NOW()),
            (uuid_generate_v4(), 'Telecommunications', 'TEL', NOW(), NOW()),
            (uuid_generate_v4(), 'Agriculture', 'AGR', NOW(), NOW()),
            (uuid_generate_v4(), 'Hospitality', 'HSP', NOW(), NOW()),
            (uuid_generate_v4(), 'Entertainment', 'ENT', NOW(), NOW()),
            (uuid_generate_v4(), 'Real Estate', 'REA', NOW(), NOW()),
            (uuid_generate_v4(), 'Legal', 'LEG', NOW(), NOW()),
            (uuid_generate_v4(), 'Marketing', 'MKT', NOW(), NOW()),
            (uuid_generate_v4(), 'Pharmaceuticals', 'PHM', NOW(), NOW()),
            (uuid_generate_v4(), 'Automotive', 'AUT', NOW(), NOW()),
            (uuid_generate_v4(), 'Aerospace', 'AER', NOW(), NOW()),
            (uuid_generate_v4(), 'Insurance', 'INS', NOW(), NOW()),
            (uuid_generate_v4(), 'Biotechnology', 'BIO', NOW(), NOW()),
            (uuid_generate_v4(), 'Mining', 'MIN', NOW(), NOW()),
            (uuid_generate_v4(), 'Waste Management', 'WMT', NOW(), NOW()),
            (uuid_generate_v4(), 'Food & Beverages', 'FNB', NOW(), NOW()),
            (uuid_generate_v4(), 'Media & Publishing', 'MED', NOW(), NOW()),
            (uuid_generate_v4(), 'Security', 'SEC', NOW(), NOW()),
            (uuid_generate_v4(), 'Sports', 'SPT', NOW(), NOW()),
            (uuid_generate_v4(), 'Fashion', 'FSH', NOW(), NOW()),
            (uuid_generate_v4(), 'Nonprofit & NGOs', 'NPO', NOW(), NOW()),
            (uuid_generate_v4(), 'Human Resources', 'HRM', NOW(), NOW()),
            (uuid_generate_v4(), 'E-commerce', 'ECM', NOW(), NOW()),
            (uuid_generate_v4(), 'Petroleum', 'PET', NOW(), NOW()),
            (uuid_generate_v4(), 'Logistics & Supply Chain', 'LSC', NOW(), NOW()),
            (uuid_generate_v4(), 'Gaming', 'GAM', NOW(), NOW()),
            (uuid_generate_v4(), 'Art & Design', 'ART', NOW(), NOW()),
            (uuid_generate_v4(), 'Marine & Shipping', 'MNS', NOW(), NOW()),
            (uuid_generate_v4(), 'Electronics', 'ELC', NOW(), NOW()),
            (uuid_generate_v4(), 'Waste Recycling', 'REC', NOW(), NOW());

        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "industries"`);
    }

}
