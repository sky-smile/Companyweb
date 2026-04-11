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
import { UploadQueryDto } from './dto/upload-query.dto';
import { UploadService } from './upload.service';

const uploadOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 增加到 10MB
  },
  preserveFilename: true, // 保留原始文件名，确保正确处理中文
  fileFilter: (req, file, cb) => {
    // 确保文件名正确编码
    if (file.originalname) {
      // 尝试解码可能的错误编码
      try {
        // 如果是 Buffer，转换为字符串
        if (Buffer.isBuffer(file.originalname)) {
          file.originalname = file.originalname.toString('utf8');
        }
      } catch (error) {
        // 忽略解码错误，使用原始值
      }
    }
    cb(null, true);
  },
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
