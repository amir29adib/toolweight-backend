import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiFile } from 'src/common/decorators/api-file.decorator';
import { FileValidatePipe } from 'src/common/pipes/file-validate.pipe';
import { FilesService } from './files.service';
import { GetPrivateUrlsDto } from './dto/get-private-urls.dto';

@ApiTags('Files')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('private-urls')
  async getPrivateFileUrls(@Body() dto: GetPrivateUrlsDto) {
    const expiresIn = dto.expiresInSeconds ?? 300;
    const items = await this.filesService.getPrivateFileUrls(
      dto.keys,
      expiresIn,
    );

    return {
      expiresIn,
      items,
    };
  }

  @Get('private-url')
  async getPrivateFileUrl(@Query('key') key: string) {
    const expiresInSeconds = 300;
    const url = await this.filesService.getPrivateFileUrl(
      key,
      expiresInSeconds,
    );

    return {
      url,
      expiresIn: expiresInSeconds,
    };
  }

  @Post('upload/tmp/:fileKey')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile('file')
  async uploadTmpFile(
    @Param('fileKey') fileKey: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const rule = this.filesService.getRuleOrThrow(fileKey);

    const pipe = new FileValidatePipe(rule.fileType);
    pipe.transform(file, { type: 'body' } as any);

    return this.filesService.uploadTmpFile(fileKey, file);
  }
}
