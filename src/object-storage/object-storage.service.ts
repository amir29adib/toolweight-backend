import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { S3_CLIENT } from './s3.constants';

@Injectable()
export class ObjectStorageService {
  private readonly logger = new Logger(ObjectStorageService.name);
  private readonly bucket: string;

  constructor(
    private readonly cfg: ConfigService,
    @Inject(S3_CLIENT) private readonly s3: S3Client,
  ) {
    this.bucket = this.cfg.get<string>('OBJECT_STORAGE_BUCKET_NAME')!;
  }

  private async ensureBucketExists() {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch (e) {
      throw new NotFoundException(
        `Bucket "${this.bucket}" not found. Create it in Liara panel.`,
      );
    }
  }

  async uploadFile(objectKey: string, buffer: Buffer, mimeType: string) {
    await this.ensureBucketExists();
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
        Body: buffer,
        ContentType: mimeType,
      }),
    );
    return `${objectKey}`;
  }

  async getFileStream(objectKey: string): Promise<NodeJS.ReadableStream> {
    try {
      const obj = await this.s3.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: objectKey }),
      );
      return obj.Body as NodeJS.ReadableStream;
    } catch (error: any) {
      this.logger.error(`S3 GetObject Error: ${error?.message}`);
      if (error?.$metadata?.httpStatusCode === 404) {
        throw new NotFoundException(
          'The requested file was not found in storage.',
        );
      }
      throw error;
    }
  }

  async generatePresignedUrl(objectKey: string, expiresInSeconds = 300) {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: objectKey });
    return getSignedUrl(this.s3, cmd, { expiresIn: expiresInSeconds });
  }

  async deleteFile(objectKey: string) {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: objectKey }),
    );
    return { ok: true };
  }
}
