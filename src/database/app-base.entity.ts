import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class AppBaseEntity {
  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamptz',
    default: () => 'now()',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
