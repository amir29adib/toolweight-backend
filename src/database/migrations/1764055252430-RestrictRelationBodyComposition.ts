import { MigrationInterface, QueryRunner } from 'typeorm';

export class RestrictRelationBodyComposition1764055252430
  implements MigrationInterface
{
  name = 'RestrictRelationBodyComposition1764055252430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "body_composition" DROP CONSTRAINT "FK_bd2c57eacbe81cec89ab660fd4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "body_composition" ADD CONSTRAINT "FK_bd2c57eacbe81cec89ab660fd4a" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "body_composition" DROP CONSTRAINT "FK_bd2c57eacbe81cec89ab660fd4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "body_composition" ADD CONSTRAINT "FK_bd2c57eacbe81cec89ab660fd4a" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
