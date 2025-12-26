import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { UserGroupAccessModule } from './user/group/access/access.module';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './database/seeder/seeder.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { BlacklistTokenModule } from './blacklist/token/blacklist-token.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ObjectStorageModule } from './object-storage/object-storage.module';
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';
import { AthleteModule } from './athlete/athlete.module';
import { BodyCompositionModule } from './athlete/body-composition/body-composition.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    UserGroupAccessModule,
    AuthModule,
    SeederModule,
    BlacklistModule,
    BlacklistTokenModule,
    ScheduleModule.forRoot(),
    ObjectStorageModule,
    FilesModule,
    AthleteModule,
    BodyCompositionModule,
  ],
  controllers: [AppController],
  providers: [AppService, FilesService],
})
export class AppModule {}
