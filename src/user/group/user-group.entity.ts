import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { AppBaseEntity } from 'src/database/app-base.entity';
import { UserEntity } from '../user.entity';
import { UserGroupAccessEntity } from './access/access.entity';

@Entity({ name: 'user_groups' })
export class UserGroupEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @OneToMany(() => UserEntity, (user) => user.userGroup)
  users: UserEntity[];

  @ManyToMany(() => UserGroupAccessEntity, (access) => access.groups, {
    cascade: false,
  })
  @JoinTable({
    name: 'user_group_access_map',
    joinColumn: { name: 'user_group_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'user_group_access_id',
      referencedColumnName: 'id',
    },
  })
  access: UserGroupAccessEntity[];
}
