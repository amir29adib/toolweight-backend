import { AppBaseEntity } from 'src/database/app-base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserGroupEntity } from './group/user-group.entity';

@Entity({ name: 'users' })
export class UserEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'userGroupId', type: 'int', nullable: true })
  userGroupId: number | null;

  @ManyToOne(() => UserGroupEntity, (group) => group.users, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'userGroupId' })
  userGroup: UserGroupEntity | null;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstname: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastname: string | null;

  @Index({ unique: true, where: '"nationalId" IS NOT NULL' })
  @Column({ name: 'nationalId', type: 'varchar', length: 20, nullable: true })
  nationalId: string | null;

  @Column({ type: 'date', nullable: true })
  birthdate: string | null;

  @Column({
    type: 'enum',
    enum: ['male', 'female'],
    name: 'gender',
    nullable: true,
  })
  gender: 'male' | 'female' | null;

  @Index({ unique: true })
  @Column({ name: 'mobileNumber', type: 'varchar', length: 20, nullable: true })
  mobileNumber: string | null;

  @Column({ name: 'loginCode', type: 'varchar', length: 16, nullable: true })
  loginCode: string | null;

  @Index({ unique: true, where: '"email" IS NOT NULL' })
  @Column({ type: 'varchar', length: 191, nullable: true })
  email: string | null;

  @Column({ type: 'jsonb', nullable: true })
  profile: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ name: 'status', type: 'boolean', default: false })
  status: boolean;
}
