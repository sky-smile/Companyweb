import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request } from 'express';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { UploadQueryDto } from './dto/upload-query.dto';
import { UploadService } from './upload.service';

/**
 * 从 Content-Type boundary 中提取原始文件名
 * 这是处理中文文件名的最可靠方法
 */
function decodeFilenameFromRequest(req: Request): string | null {
  // 方法 1: 从 Content-Disposition 头提取 UTF-8 文件名 (RFC 5987)
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    // 需要从原始 body 中解析，但 Express 已经解析过了
    // 所以我们依赖 Multer 提供的信息
  }

  // 方法 2: 使用 Node.js Buffer 转换 Multer 的 originalname
  // Multer 使用 busboy 解析文件名，可能会错误编码
  return null;
}

const uploadOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  // fileFilter 中不做特殊处理，让 Multer 正常解析
  // 实际的文件名解码在 Service 层处理
};

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @Permissions('upload:image')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query() query: UploadQueryDto,
    @Req() req: any,
  ) {
    const uploadedBy = req.user?.userId;
    if (!uploadedBy) {
      throw new Error('未获取到用户信息');
    }
    const result = await this.uploadService.saveImage(file, uploadedBy, query.folder);
    return {
      code: 0,
      message: '上传成功',
      data: {
        url: result.publicUrl,
        mediaFile: result.mediaFile,
      },
    };
  }

  @Post('file')
  @Permissions('upload:file')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query() query: UploadQueryDto,
    @Req() req: any,
  ) {
    const uploadedBy = req.user?.userId;
    if (!uploadedBy) {
      throw new Error('未获取到用户信息');
    }
    const result = await this.uploadService.saveFile(file, uploadedBy, query.folder);
    return {
      code: 0,
      message: '上传成功',
      data: {
        url: result.publicUrl,
        mediaFile: result.mediaFile,
      },
    };
  }

  @Get('files')
  @Permissions('upload:image')
  async getFiles(
    @Query('page', new ParseIntPipe()) page: number = 1,
    @Query('limit', new ParseIntPipe()) limit: number = 20,
    @Query('folder') folder?: string,
    @Query('type') type?: string,
    @Query('keyword') keyword?: string,
  ) {
    const result = await this.uploadService.findAll(page, limit, {
      folder,
      mimeType: type,
      keyword,
    });

    return {
      code: 0,
      message: 'ok',
      data: result,
    };
  }

  @Get('files/:id')
  @Permissions('upload:image')
  async getFile(@Param('id', new ParseIntPipe()) id: number) {
    const mediaFile = await this.uploadService.findOne(id);
    return {
      code: 0,
      message: 'ok',
      data: mediaFile,
    };
  }

  @Delete('files/:id')
  @Permissions('upload:image')
  async deleteFile(@Param('id', new ParseIntPipe()) id: number) {
    const result = await this.uploadService.remove(id);
    return {
      code: 0,
      message: result.message,
      data: null,
    };
  }

  @Get('statistics')
  @Permissions('upload:image')
  async getStatistics() {
    const stats = await this.uploadService.getStatistics();
    return {
      code: 0,
      message: 'ok',
      data: stats,
    };
  }
}
