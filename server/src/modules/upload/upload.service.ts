import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as fs from 'node:fs';
import { promises as fsPromises } from 'node:fs';
import * as path from 'node:path';
import { Logger } from '@nestjs/common';
import { MediaFileEntity } from '@/database/entities/media-file.entity';
import { validateImageFile, validateFileUpload } from '@/common/utils/file-validator';
import { UploadedFileView } from './interfaces/uploaded-file-view.interface';

/**
 * 修复 Multer 解析中文文件名时的编码问题
 * 
 * Multer (通过 busboy) 会将 UTF-8 文件名错误地当作 Latin-1 解析
 * 例如: "伊博.xlsx" 变成 "ä¼å.xlsx"
 * 
 * 解决方案: 将错误的字符串转回字节，再用 UTF-8 正确解码
 */
function fixFilenameEncoding(filename: string): string {
  try {
    // 检查是否包含非 ASCII 字符（可能是错误编码的 UTF-8）
    if (/[\x80-\xFF]/.test(filename)) {
      // 将 Latin-1 字符串转回原始字节
      const buffer = Buffer.from(filename, 'latin1');
      // 尝试用 UTF-8 解码
      const decoded = buffer.toString('utf8');
      // 验证解码结果是否合理（包含中文字符）
      if (/[\u4e00-\u9fa5]/.test(decoded)) {
        return decoded;
      }
    }
  } catch {
    // 解码失败，返回原始文件名
  }
  return filename;
}

@Injectable()
export class UploadService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(MediaFileEntity)
    private readonly mediaFileRepository: Repository<MediaFileEntity>,
  ) {}

  async saveImage(
    file: Express.Multer.File,
    uploadedBy: number,
    folder?: string,
  ): Promise<UploadedFileView & { mediaFile: MediaFileEntity }> {
    this.ensureFilePresent(file);
    this.ensureImageFile(file);

    const result = await this.persistFile(file, uploadedBy, folder ?? 'images');
    return result;
  }

  async saveFile(
    file: Express.Multer.File,
    uploadedBy: number,
    folder?: string,
  ): Promise<UploadedFileView & { mediaFile: MediaFileEntity }> {
    this.ensureFilePresent(file);
    this.ensureValidFile(file);

    const result = await this.persistFile(file, uploadedBy, folder ?? 'files');
    return result;
  }

  async findAll(
    page: number,
    limit: number,
    options?: {
      folder?: string;
      mimeType?: string;
      keyword?: string;
    },
  ) {
    const queryBuilder = this.mediaFileRepository.createQueryBuilder('media');

    if (options?.folder) {
      queryBuilder.andWhere('media.folder = :folder', { folder: options.folder });
    }

    if (options?.mimeType) {
      if (options.mimeType === 'image') {
        queryBuilder.andWhere('media.mime_type LIKE :mimeType', { mimeType: 'image/%' });
      } else {
        queryBuilder.andWhere('media.mime_type = :mimeType', { mimeType: options.mimeType });
      }
    }

    if (options?.keyword) {
      queryBuilder.andWhere('media.original_name LIKE :keyword', {
        keyword: `%${options.keyword}%`,
      });
    }

    queryBuilder.orderBy('media.created_at', 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const mediaFile = await this.mediaFileRepository.findOne({ where: { id } });
    if (!mediaFile) {
      throw new BadRequestException('媒体文件不存在');
    }
    return mediaFile;
  }

  private readonly logger = new Logger(UploadService.name);

  async remove(id: number) {
    const mediaFile = await this.findOne(id);

    // 异步删除物理文件，失败只记日志不阻止数据库记录删除
    await this.tryRemoveFile(mediaFile.storagePath);

    // 删除缩略图
    if (mediaFile.thumbnailUrl) {
      const uploadDir = this.configService.get<string>('upload.dir', 'uploads');
      const thumbnailPath = path.join(uploadDir, mediaFile.thumbnailUrl.split('/uploads/')[1]);
      await this.tryRemoveFile(thumbnailPath);
    }

    // 删除数据库记录
    await this.mediaFileRepository.delete(id);

    return { message: '删除成功' };
  }

  private async tryRemoveFile(filePath: string) {
    try {
      await fsPromises.access(filePath);
      await fsPromises.unlink(filePath);
    } catch (error) {
      // 文件不存在或无法删除时只记日志，不抛异常
      this.logger.warn(`文件删除失败: ${filePath}`, error instanceof Error ? error.message : error);
    }
  }

  async getStatistics() {
    const [totalResult, imageResult, documentResult, otherResult, folderResult] =
      await Promise.all([
        this.mediaFileRepository.count(),
        this.mediaFileRepository
          .createQueryBuilder('media')
          .where('media.mime_type LIKE :type', { type: 'image/%' })
          .getCount(),
        this.mediaFileRepository
          .createQueryBuilder('media')
          .where('media.mime_type IN (:...types)', {
            types: [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'text/plain',
            ],
          })
          .getCount(),
        this.mediaFileRepository
          .createQueryBuilder('media')
          .where('media.mime_type NOT LIKE :type1', { type1: 'image/%' })
          .andWhere('media.mime_type NOT IN (:...types)', {
            types: [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'text/plain',
            ],
          })
          .getCount(),
        this.mediaFileRepository
          .createQueryBuilder('media')
          .select('media.folder', 'folder')
          .addSelect('COUNT(*)', 'count')
          .groupBy('media.folder')
          .getRawMany(),
      ]);

    return {
      total: totalResult,
      images: imageResult,
      documents: documentResult,
      others: otherResult,
      byFolder: folderResult,
    };
  }

  private async persistFile(
    file: Express.Multer.File,
    uploadedBy: number,
    folder: string,
  ): Promise<UploadedFileView & { mediaFile: MediaFileEntity }> {
    const uploadDir = this.configService.get<string>('upload.dir', 'uploads');
    const baseUrl = this.configService.get<string>('upload.baseUrl', '/uploads');
    const normalizedFolder = this.normalizeFolder(folder);
    const targetDir = path.join(uploadDir, normalizedFolder);

    // 修复中文文件名的编码问题
    const originalName = fixFilenameEncoding(file.originalname);
    const extension = path.extname(originalName);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
    const storagePath = path.join(targetDir, filename);

    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(storagePath, file.buffer);

    const publicUrl = `${baseUrl}/${normalizedFolder}/${filename}`;

    // 保存到数据库
    const insertResult = await this.mediaFileRepository.insert({
      originalName,
      filename,
      storagePath,
      publicUrl,
      mimeType: file.mimetype,
      size: file.size,
      extension: extension.replace('.', ''),
      folder: normalizedFolder,
      uploadedBy,
    });

    const savedMediaFile = await this.mediaFileRepository.findOne({
      where: { id: insertResult.identifiers[0].id },
    }) as MediaFileEntity;

    return {
      originalName,
      mimeType: file.mimetype,
      size: file.size,
      filename,
      storagePath,
      publicUrl,
      mediaFile: savedMediaFile,
    };
  }

  private ensureFilePresent(file?: Express.Multer.File): asserts file is Express.Multer.File {
    if (file === undefined) {
      throw new BadRequestException('File is required');
    }
  }

  private ensureImageFile(file: Express.Multer.File): void {
    const error = validateImageFile(file.mimetype, file.buffer);
    if (error !== null) {
      throw new BadRequestException(error);
    }
  }

  private ensureValidFile(file: Express.Multer.File): void {
    const extension = path.extname(file.originalname);
    const error = validateFileUpload(file.mimetype, extension);
    if (error !== null) {
      throw new BadRequestException(error);
    }
  }

  private normalizeFolder(folder: string): string {
    const normalized = folder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

    return normalized === '' ? 'common' : normalized;
  }
}
