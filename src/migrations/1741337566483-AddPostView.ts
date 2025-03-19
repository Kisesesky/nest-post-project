import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostView1741337566483 implements MigrationInterface {
    name = 'AddPostView1741337566483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "postId" uuid, CONSTRAINT "PK_89a020aa096a078dc6f602ffe20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post_view" ADD CONSTRAINT "FK_29ab73695903a3b0f2fbaa27a82" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_view" ADD CONSTRAINT "FK_0ec6553d64793fc8970dc5fab4a" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_view" DROP CONSTRAINT "FK_0ec6553d64793fc8970dc5fab4a"`);
        await queryRunner.query(`ALTER TABLE "post_view" DROP CONSTRAINT "FK_29ab73695903a3b0f2fbaa27a82"`);
        await queryRunner.query(`DROP TABLE "post_view"`);
    }

}
