import { MigrationInterface, QueryRunner } from 'typeorm';

export class AthleteMigration1764054780197 implements MigrationInterface {
  name = 'AthleteMigration1764054780197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."athletes_sex_enum" AS ENUM('male', 'female')`,
    );
    await queryRunner.query(
      `CREATE TABLE "athletes" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "athleteId" character varying(191) NOT NULL, "sex" "public"."athletes_sex_enum" NOT NULL DEFAULT 'male', "name" character varying(191), "weight_class" character varying(200), CONSTRAINT "UQ_b76316de0a1975bae264299aa9a" UNIQUE ("athleteId"), CONSTRAINT "PK_3b92d2bd187b2b2d27d4c47f1c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "body_composition" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "athlete_id" uuid NOT NULL, "test_date_time" character varying(50) NOT NULL, "height" double precision, "weight" double precision, "lower_limit_weight_normal_range" double precision, "upper_limit_weight_normal_range" double precision, "bmi" double precision, "lower_limit_bmi_normal_range" double precision, "upper_limit_bmi_normal_range" double precision, "bmr" double precision, "lower_limit_bmr_normal_range" double precision, "upper_limit_bmr_normal_range" double precision, "slm" double precision, "lower_limit_slm_normal_range" double precision, "upper_limit_slm_normal_range" double precision, "tbw" double precision, "lower_limit_tbw_normal_range" double precision, "upper_limit_tbw_normal_range" double precision, "protein" double precision, "minerals" double precision, "lower_limit_protein_normal_range" double precision, "upper_limit_protein_normal_range" double precision, "visceral_fat" double precision, "lower_limit_visceral_fat_of_abdomen_normal_range" double precision, "upper_limit_visceral_fat_of_abdomen_normal_range" double precision, "subcutaneous_fat" double precision, "lower_limit_subcutaneous_fat_of_abdomen_normal_range" double precision, "upper_limit_subcutaneous_fat_of_abdomen_normal_range" double precision, "icw" double precision, "lower_limit_icw_normal_range" double precision, "upper_limit_icw_normal_range" double precision, "ecw" double precision, "lower_limit_ecw_normal_range" double precision, "upper_limit_ecw_normal_range" double precision, "pbf" double precision, "lower_limit_pbf_normal_range" double precision, "upper_limit_pbf_normal_range" double precision, "smm" double precision, "lower_limit_smm_normal_range" double precision, "upper_limit_smm_normal_range" double precision, "smi" double precision, "ffmi" double precision, "fmi" double precision, "bfm" double precision, "lower_limit_bfm_normal_range" double precision, "upper_limit_bfm_normal_range" double precision, CONSTRAINT "PK_2b430e3bc4e3a052f3852ce751a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "body_composition" ADD CONSTRAINT "FK_bd2c57eacbe81cec89ab660fd4a" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "body_composition" DROP CONSTRAINT "FK_bd2c57eacbe81cec89ab660fd4a"`,
    );
    await queryRunner.query(`DROP TABLE "body_composition"`);
    await queryRunner.query(`DROP TABLE "athletes"`);
    await queryRunner.query(`DROP TYPE "public"."athletes_sex_enum"`);
  }
}
