import { AppBaseEntity } from 'src/database/app-base.entity';
import { GenderEnum } from 'src/user/enums/gender.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'athletes' })
export class AthleteEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 191,
    unique: true,
  })
  athleteId: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    default: GenderEnum.male,
  })
  sex: GenderEnum;

  @Column({
    type: 'varchar',
    length: 191,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'weight_class',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  weightClass: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  profile: string;
}
