import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnSocial1742530202579 implements MigrationInterface {
    name = 'AddColumnSocial1742530202579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "registerType"`);
        await queryRunner.query(`CREATE TYPE "public"."user_registertype_enum" AS ENUM('google', 'naver', 'kakao', 'common')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "registerType" "public"."user_registertype_enum" NOT NULL DEFAULT 'common'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "registerType"`);
        await queryRunner.query(`DROP TYPE "public"."user_registertype_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "registerType" character varying NOT NULL DEFAULT 'common'`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
    }

}
