import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AppBaseEntity } from 'src/database/app-base.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'otpTokens' })
export class OtpTokenEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'userId', type: 'int' })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Index()
  @Column({ name: 'code', type: 'varchar', length: 12 })
  code: string;

  @Column({ name: 'expiresAt', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'consumed', type: 'boolean', default: false })
  consumed: boolean;

  @Column({ name: 'attempts', type: 'smallint', default: 0 })
  attempts: number;
}
