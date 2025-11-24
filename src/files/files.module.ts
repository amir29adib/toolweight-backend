import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';
import { FilesController } from './files.controller';

@Module({
  imports: [ObjectStorageModule],
  providers: [FilesService],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
