import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
    fileSize: 5 * 1024 * 1024,
  },
};

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @Permissions('upload:image')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Query() query: UploadQueryDto) {
    return this.uploadService.saveImage(file, query.folder);
  }

  @Post('file')
  @Permissions('upload:file')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Query() query: UploadQueryDto) {
    return this.uploadService.saveFile(file, query.folder);
  }
}
