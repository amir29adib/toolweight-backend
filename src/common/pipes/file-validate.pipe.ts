import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { AllowedFileType } from 'src/files/types/allowed-file-type';

const MIME_TYPES: Record<AllowedFileType, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  pdf: ['application/pdf'],
  excel: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ],
  zip: ['application/zip', 'application/x-zip-compressed'],
  dbf: ['application/octet-stream', 'application/x-dbf'],
};

@Injectable()
export class FileValidatePipe implements PipeTransform {
  constructor(private readonly allowedType: AllowedFileType) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const file = value as Express.Multer.File;

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const validMimes = MIME_TYPES[this.allowedType];
    if (!validMimes.some((mime) => file.mimetype === mime)) {
      throw new BadRequestException(
        `Invalid file type. Only ${this.allowedType} files are allowed.`,
      );
    }

    return file;
  }
}
