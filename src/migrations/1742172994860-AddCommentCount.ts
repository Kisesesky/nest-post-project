import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentCount1742172994860 implements MigrationInterface {
    name = 'AddCommentCount1742172994860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "comment" TO "commentCount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "commentCount" TO "comment"`);
    }

}
