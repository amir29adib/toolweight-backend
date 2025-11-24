import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { SeederService } from './seeder.service';
import { UserGroupEntity } from 'src/user/group/user-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserGroupEntity])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
