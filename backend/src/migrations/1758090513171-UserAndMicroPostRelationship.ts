import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAndMicroPostRelationship1758090513171 implements MigrationInterface {
    name = 'UserAndMicroPostRelationship1758090513171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_posts" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "micro_posts" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "micro_posts" ADD CONSTRAINT "FK_5ebcc9df4041379458c06af5b2f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_posts" DROP CONSTRAINT "FK_5ebcc9df4041379458c06af5b2f"`);
        await queryRunner.query(`ALTER TABLE "micro_posts" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "micro_posts" ALTER COLUMN "user_id" SET NOT NULL`);
    }

}
