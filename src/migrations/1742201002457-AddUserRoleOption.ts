import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRoleOption1742201002457 implements MigrationInterface {
    name = 'AddUserRoleOption1742201002457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'common'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
