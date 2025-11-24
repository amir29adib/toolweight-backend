import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { ObjectStorageService } from './object-storage.service';
import { S3_CLIENT } from './s3.constants';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3_CLIENT,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) =>
        new S3Client({
          region: 'default',
          endpoint: cfg.get<string>('OBJECT_STORAGE_ENDPOINT')!,
          forcePathStyle: true,
          credentials: {
            accessKeyId: cfg.get<string>('OBJECT_STORAGE_ACCESS_KEY')!,
            secretAccessKey: cfg.get<string>('OBJECT_STORAGE_SECRET_KEY')!,
          },
        }),
    },
    ObjectStorageService,
  ],
  exports: [ObjectStorageService],
})
export class ObjectStorageModule {}
