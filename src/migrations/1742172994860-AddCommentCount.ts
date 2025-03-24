import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentCount1742172994860 implements MigrationInterface {
    name = 'AddCommentCount1742172994860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD COLUMN "commentCount" INTEGER DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "commentCount"`);
    }
}
