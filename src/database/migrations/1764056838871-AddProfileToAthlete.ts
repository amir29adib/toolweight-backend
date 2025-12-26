import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileToAthlete1764056838871 implements MigrationInterface {
  name = 'AddProfileToAthlete1764056838871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "athletes" ADD "profile" character varying(200)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "athletes" DROP COLUMN "profile"`);
  }
}
