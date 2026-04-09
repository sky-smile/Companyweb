import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { UploadedFileView } from './interfaces/uploaded-file-view.interface';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  saveImage(file: Express.Multer.File, folder?: string): UploadedFileView {
    this.ensureFilePresent(file);
    this.ensureImageFile(file);

    return this.persistFile(file, folder ?? 'images');
  }

  saveFile(file: Express.Multer.File, folder?: string): UploadedFileView {
    this.ensureFilePresent(file);

    return this.persistFile(file, folder ?? 'files');
  }

  private persistFile(file: Express.Multer.File, folder: string): UploadedFileView {
    const uploadDir = this.configService.get<string>('upload.dir', 'uploads');
    const baseUrl = this.configService.get<string>('upload.baseUrl', 'http://localhost:3000/uploads');
    const normalizedFolder = this.normalizeFolder(folder);
    const targetDir = path.join(uploadDir, normalizedFolder);
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
    const storagePath = path.join(targetDir, filename);

    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(storagePath, file.buffer);

    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      filename,
      storagePath,
      publicUrl: `${baseUrl}/${normalizedFolder}/${filename}`,
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
