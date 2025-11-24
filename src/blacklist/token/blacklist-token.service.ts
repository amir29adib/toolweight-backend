import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BlacklistTokenEntity } from './blacklist-token.entity';

@Injectable()
export class BlacklistTokenService {
  constructor(
    @InjectRepository(BlacklistTokenEntity)
    private readonly repo: Repository<BlacklistTokenEntity>,
  ) {}

  async add(jti: string, exp: number): Promise<void> {
    if (!jti || !exp) return;
    const expiresAt = new Date(exp * 1000);
    await this.repo
      .createQueryBuilder()
      .insert()
      .into(BlacklistTokenEntity)
      .values({ jti, expiresAt })
      .orIgnore()
      .execute();
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    if (!jti) return false;
    const exists = await this.repo.exist({
      where: { jti, expiresAt: MoreThan(new Date()) },
    });
    return exists;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanup(): Promise<void> {
    await this.repo.delete({
      expiresAt: LessThan(new Date(Date.now() - 30 * 60 * 1000)),
    });
  }
}
