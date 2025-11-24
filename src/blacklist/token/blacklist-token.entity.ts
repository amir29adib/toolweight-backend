import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'token_blacklist' })
export class BlacklistTokenEntity {
  @PrimaryColumn('uuid')
  jti!: string;

  @Index('idx_token_blacklist_expires')
  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
