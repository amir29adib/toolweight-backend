import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ObjectStorageService } from '../object-storage/object-storage.service';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import {
  ALLOWED_FILE_RULES,
  AllowedFileKey,
  AllowedFileRule,
  AllowedFileType,
  AllowedFolderType,
} from './types/allowed-file-type';
import { Cron } from '@nestjs/schedule';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { lookup as lookupMimeType } from 'mime-types';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
private readonly tmpUploadRoot = path.join(os.tmpdir(), 'uploads');

  constructor(private readonly objectStorageService: ObjectStorageService) {}

  getRuleOrThrow(fileKey: string): AllowedFileRule & { key: AllowedFileKey } {
    const rule = (ALLOWED_FILE_RULES as Record<string, AllowedFileRule>)[
      fileKey
    ];

    if (!rule) {
      throw new BadRequestException(`Upload key "${fileKey}" is not allowed.`);
    }

    return { key: fileKey as AllowedFileKey, ...rule };
  }

  private async ensureTmpDir(rule: AllowedFileRule & { key: AllowedFileKey }) {
    const dir = path.join(this.tmpUploadRoot, rule.folder, rule.key);

    await fs.promises.mkdir(dir, { recursive: true }).catch((err) => {
      this.logger.error('Error creating tmp directory', err);
      throw err;
    });

    return dir;
  }

  async uploadTmpFile(fileKey: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const rule = this.getRuleOrThrow(fileKey);
    const dir = await this.ensureTmpDir(rule);

    const ext = extname(file.originalname) || '';
    const filename = `${randomUUID()}${ext}`;
    const filePath = path.join(dir, filename);
    const relativePath = path.join(rule.folder, rule.key, filename);

    await fs.promises.writeFile(filePath, file.buffer).catch((err) => {
      this.logger.error('Error writing tmp file', err);
      throw err;
    });

    return {
      message:
        'File uploaded successfully and scheduled for deletion in 5 minutes.',
      key: rule.key,
      folder: rule.folder,
      fileType: rule.fileType,
      filename,
      path: relativePath,
      size: file.size,
    };
  }

  async copyTmpFileToObjectStorage(
    fileKey: AllowedFileKey,
    relativePath: string,
    entityId: string | number,
  ) {
    const rule = this.getRuleOrThrow(fileKey);

    const tmpFilePath = path.join(
      this.tmpUploadRoot,
      ...relativePath.split(/[\\/]/),
    );

    const exists = await fs.promises
      .access(tmpFilePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      throw new BadRequestException('Temporary file not found');
    }

    const fileBuffer = await fs.promises.readFile(tmpFilePath);
    const mimeType =
      (lookupMimeType(tmpFilePath) as string) || 'application/octet-stream';

    const filenameOnly = path.basename(tmpFilePath);

    const objectKey = `${rule.folder}/${entityId}/${rule.fileType}/${filenameOnly}`;

    await this.objectStorageService.uploadFile(objectKey, fileBuffer, mimeType);

    return { objectKey };
  }

  async uploadFileByType(
    folder: AllowedFolderType,
    id: string | number,
    type: AllowedFileType,
    file: Express.Multer.File,
  ) {
    const fileObjectKey = `${folder}/${id}/${type}/${randomUUID()}${extname(file.originalname)}`;
    return this.objectStorageService.uploadFile(
      fileObjectKey,
      file.buffer,
      file.mimetype,
    );
  }

  async getPrivateFileUrls(objectKeys: string[], expiresInSeconds = 300) {
    const urls = await Promise.all(
      objectKeys.map((key) => this.getPrivateFileUrl(key, expiresInSeconds)),
    );

    return objectKeys.map((key, idx) => ({
      key,
      url: urls[idx],
    }));
  }

  async getPrivateFileUrl(objectKey: string, expiresInSeconds = 300) {
    return this.objectStorageService.generatePresignedUrl(
      objectKey,
      expiresInSeconds,
    );
  }

  async deleteFile(objectKey: string) {
    return this.objectStorageService.deleteFile(objectKey);
  }

  @Cron('*/1 * * * *')
  async cleanTmpUploads() {
    const baseDir = this.tmpUploadRoot;
    const now = Date.now();
    const expirationMs = 5 * 60 * 1000;

    const walk = async (dir: string) => {
      let entries: string[];

      try {
        entries = await fs.promises.readdir(dir);
      } catch {
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        let stat: fs.Stats;

        try {
          stat = await fs.promises.stat(fullPath);
        } catch {
          continue;
        }

        if (stat.isDirectory()) {
          await walk(fullPath);
          continue;
        }

        if (now - stat.mtimeMs > expirationMs) {
          await fs.promises.unlink(fullPath).catch((err) => {
            this.logger.warn(
              `Failed to delete tmp file: ${fullPath} – ${err?.message}`,
            );
          });
        }
      }
    };

    await walk(baseDir);
  }
}
