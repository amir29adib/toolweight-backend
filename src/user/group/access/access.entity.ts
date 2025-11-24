import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToMany,
} from 'typeorm';
import { AppBaseEntity } from 'src/database/app-base.entity';
import { UserGroupEntity } from '../user-group.entity';

@Entity({ name: 'user_group_access' })
export class UserGroupAccessEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @ManyToMany(() => UserGroupEntity, (group) => group.access)
  groups: UserGroupEntity[];
}
