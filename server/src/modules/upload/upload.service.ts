import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { MediaFileEntity } from '@/database/entities/media-file.entity';
import { UploadedFileView } from './interfaces/uploaded-file-view.interface';

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

  async remove(id: number) {
    const mediaFile = await this.findOne(id);

    // 删除物理文件
    const fullPath = mediaFile.storagePath;
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // 删除缩略图
    if (mediaFile.thumbnailUrl) {
      const uploadDir = this.configService.get<string>('upload.dir', 'uploads');
      const thumbnailPath = path.join(uploadDir, mediaFile.thumbnailUrl.split('/uploads/')[1]);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // 删除数据库记录
    await this.mediaFileRepository.delete(id);

    return { message: '删除成功' };
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
    const baseUrl = this.configService.get<string>('upload.baseUrl', 'http://localhost:3000/uploads');
    const normalizedFolder = this.normalizeFolder(folder);
    const targetDir = path.join(uploadDir, normalizedFolder);
    
    // 正确处理中文文件名
    // Multer 会将 UTF-8 文件名错误地解析为 Latin-1，需要转换回来
    let originalName = file.originalname;
    
    // 方法 1：尝试修复 Latin-1 误解析为 UTF-8 的问题
    try {
      // 将错误的 Latin-1 字符串转回字节，再用 UTF-8 解码
      const buffer = Buffer.from(file.originalname, 'latin1');
      const decoded = buffer.toString('utf8');
      // 如果解码后看起来合理（包含中文字符），使用解码后的值
      if (/[\u4e00-\u9fa5]/.test(decoded)) {
        originalName = decoded;
      }
    } catch {
      // 忽略解码错误
    }
    
    // 方法 2：尝试 URL 解码（处理浏览器预编码的情况）
    try {
      const urlDecoded = decodeURIComponent(originalName);
      if (urlDecoded !== originalName) {
        originalName = urlDecoded;
      }
    } catch {
      // 忽略解码错误
    }
    
    const extension = path.extname(originalName);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
    const storagePath = path.join(targetDir, filename);

    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(storagePath, file.buffer);

    const publicUrl = `${baseUrl}/${normalizedFolder}/${filename}`;

    // 如果是图片，尝试获取尺寸信息（不生成缩略图）
    let width: number | null = null;
    let height: number | null = null;
    let thumbnailUrl: string | null = null;

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
      ...(width !== null && { width }),
      ...(height !== null && { height }),
      ...(thumbnailUrl !== null && { thumbnailUrl }),
      uploadedBy,
    });

    const savedMediaFile = await this.mediaFileRepository.findOne({
      where: { id: insertResult.generatedMaps[0] as any },
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
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
  }

  private normalizeFolder(folder: string): string {
    const normalized = folder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

    return normalized === '' ? 'common' : normalized;
  }
}
