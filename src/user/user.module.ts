import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupAccessEntity } from './group/access/access.entity';
import { UserGroupEntity } from './group/user-group.entity';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMobileEntity } from './entities/user-mobile.entity';
import { UserPhoneEntity } from './entities/user-phone.entity';
import { UserRelativeMobileEntity } from './entities/user-relative-mobile.entity';
import { UserGroupRepository } from './group/user-group.repository';
import { UserGroupService } from './group/user-group.service';
import { UserGroupController } from './group/user-group.controller';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserGroupEntity,
      UserGroupAccessEntity,
      UserMobileEntity,
      UserPhoneEntity,
      UserRelativeMobileEntity,
    ]),
    FilesModule,
  ],
  providers: [
    UserRepository,
    UserService,
    UserGroupRepository,
    UserGroupService,
  ],
  controllers: [UserController, UserGroupController],
  exports: [UserService, UserGroupService],
})
export class UserModule {}
