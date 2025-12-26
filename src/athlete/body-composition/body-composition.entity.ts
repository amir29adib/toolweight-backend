import { AppBaseEntity } from 'src/database/app-base.entity';
import { AthleteEntity } from 'src/athlete/athlete.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'body_composition' })
export class BodyCompositionEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AthleteEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'athlete_id' })
  athlete: AthleteEntity;

  @Column({ name: 'athlete_id', type: 'uuid' })
  athleteId: string;

  @Column({ name: 'test_date_time', type: 'varchar', length: 50 })
  testDateTime: string;

  @Column({ type: 'float', nullable: true })
  height: number;

  // weight
  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({
    name: 'lower_limit_weight_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitWeightNormalRange: number;

  @Column({
    name: 'upper_limit_weight_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitWeightNormalRange: number;

  // BMI
  @Column({ type: 'float', nullable: true })
  bmi: number;

  @Column({
    name: 'lower_limit_bmi_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitBmiNormalRange: number;

  @Column({
    name: 'upper_limit_bmi_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitBmiNormalRange: number;

  // BMR
  @Column({
    type: 'float',
    nullable: true,
  })
  bmr: number;

  @Column({
    name: 'lower_limit_bmr_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitBmrNormalRange: number;

  @Column({
    name: 'upper_limit_bmr_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitBmrNormalRange: number;

  // SLM
  @Column({
    type: 'float',
    nullable: true,
  })
  slm: number;

  @Column({
    name: 'lower_limit_slm_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitSlmNormalRange: number;

  @Column({
    name: 'upper_limit_slm_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitSlmNormalRange: number;

  // TBW
  @Column({
    type: 'float',
    nullable: true,
  })
  tbw: number;

  @Column({
    name: 'lower_limit_tbw_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitTbwNormalRange: number;

  @Column({
    name: 'upper_limit_tbw_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitTbwNormalRange: number;

  // Protein And Minerals
  @Column({
    type: 'float',
    nullable: true,
  })
  protein: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  minerals: number;

  @Column({
    name: 'lower_limit_protein_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitProteinNormalRange: number;

  @Column({
    name: 'upper_limit_protein_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitProteinNormalRange: number;

  // Visceral Fat
  @Column({
    name: 'visceral_fat',
    type: 'float',
    nullable: true,
  })
  visceralFat: number;

  @Column({
    name: 'lower_limit_visceral_fat_of_abdomen_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitVisceralFatOfAbdomenNormalRange: number;

  @Column({
    name: 'upper_limit_visceral_fat_of_abdomen_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitVisceralFatOfAbdomenNormalRange: number;

  // Subcutaneous Fat
  @Column({
    name: 'subcutaneous_fat',
    type: 'float',
    nullable: true,
  })
  subcutaneousFat: number;

  @Column({
    name: 'lower_limit_subcutaneous_fat_of_abdomen_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitSubcutaneousFatOfAbdomenNormalRange: number;

  @Column({
    name: 'upper_limit_subcutaneous_fat_of_abdomen_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitSubcutaneousFatOfAbdomenNormalRange: number;

  // Intracellular Water
  @Column({
    type: 'float',
    nullable: true,
  })
  icw: number;

  @Column({
    name: 'lower_limit_icw_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitIcwNormalRange: number;

  @Column({
    name: 'upper_limit_icw_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitIcwNormalRange: number;

  // Extracellular Water
  @Column({
    type: 'float',
    nullable: true,
  })
  ecw: number;

  @Column({
    name: 'lower_limit_ecw_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitEcwNormalRange: number;

  @Column({
    name: 'upper_limit_ecw_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitEcwNormalRange: number;

  // PBF
  @Column({ type: 'float', nullable: true })
  pbf: number;

  @Column({
    name: 'lower_limit_pbf_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitPbfNormalRange: number;

  @Column({
    name: 'upper_limit_pbf_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitPbfNormalRange: number;

  // SMM
  @Column({ type: 'float', nullable: true })
  smm: number;

  @Column({
    name: 'lower_limit_smm_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitSmmNormalRange: number;

  @Column({
    name: 'upper_limit_smm_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitSmmNormalRange: number;

  // SMI
  @Column({ type: 'float', nullable: true })
  smi: number;

  // FFMI
  @Column({ type: 'float', nullable: true })
  ffmi: number;

  // FMI
  @Column({ type: 'float', nullable: true })
  fmi: number;

  // BFM
  @Column({ type: 'float', nullable: true })
  bfm: number;

  @Column({
    name: 'lower_limit_bfm_normal_range',
    type: 'float',
    nullable: true,
  })
  lowerLimitBfmNormalRange: number;

  @Column({
    name: 'upper_limit_bfm_normal_range',
    type: 'float',
    nullable: true,
  })
  upperLimitBfmNormalRange: number;
}
