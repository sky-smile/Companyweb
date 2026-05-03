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
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request.type';
import { UploadQueryDto } from './dto/upload-query.dto';
import { UploadListQueryDto } from './dto/upload-list-query.dto';
import { UploadService } from './upload.service';

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
    @Req() req: AuthenticatedRequest,
  ) {
    const uploadedBy = Number(req.user?.userId);
    if (!uploadedBy) {
      throw new Error('未获取到用户信息');
    }
    const result = await this.uploadService.saveImage(file, uploadedBy, query.folder);
    return {
      code: 0,
      message: '上传成功',
      data: {
        originalName: result.originalName,
        mimeType: result.mimeType,
        size: result.size,
        filename: result.filename,
        storagePath: result.storagePath,
        publicUrl: result.publicUrl,
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
    @Req() req: AuthenticatedRequest,
  ) {
    const uploadedBy = Number(req.user?.userId);
    if (!uploadedBy) {
      throw new Error('未获取到用户信息');
    }
    const result = await this.uploadService.saveFile(file, uploadedBy, query.folder);
    return {
      code: 0,
      message: '上传成功',
      data: {
        originalName: result.originalName,
        mimeType: result.mimeType,
        size: result.size,
        filename: result.filename,
        storagePath: result.storagePath,
        publicUrl: result.publicUrl,
        mediaFile: result.mediaFile,
      },
    };
  }

  @Get('files')
  @Permissions('upload:image')
  async getFiles(@Query() query: UploadListQueryDto) {
    const result = await this.uploadService.findAll(query.page, query.limit, {
      folder: query.folder,
      mimeType: query.type,
      keyword: query.keyword,
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
