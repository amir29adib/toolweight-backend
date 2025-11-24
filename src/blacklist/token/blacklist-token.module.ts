import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistTokenEntity } from './blacklist-token.entity';
import { BlacklistTokenService } from './blacklist-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistTokenEntity])],
  providers: [BlacklistTokenService],
  exports: [BlacklistTokenService],
})
export class BlacklistTokenModule {}
