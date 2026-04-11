import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdminUserEntity } from './admin-user.entity';

@Entity({ name: 'media_files' })
export class MediaFileEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ name: 'original_name', length: 255, comment: '原始文件名' })
  originalName!: string;

  @Column({ name: 'filename', length: 255, comment: '存储文件名' })
  filename!: string;

  @Column({ name: 'storage_path', length: 500, comment: '存储路径（相对路径）' })
  storagePath!: string;

  @Column({ name: 'public_url', length: 500, comment: '公开访问 URL' })
  publicUrl!: string;

  @Column({ name: 'mime_type', length: 100, comment: 'MIME 类型' })
  mimeType!: string;

  @Column({ type: 'int', comment: '文件大小（字节）' })
  size!: number;

  @Column({ name: 'extension', length: 20, comment: '文件扩展名' })
  extension!: string;

  @Column({ name: 'folder', length: 100, nullable: true, comment: '上传目录', default: null })
  folder!: string;

  @Column({ type: 'int', nullable: true, comment: '图片宽度（仅图片文件）', default: null })
  width!: number;

  @Column({ type: 'int', nullable: true, comment: '图片高度（仅图片文件）', default: null })
  height!: number;

  @Column({ name: 'thumbnail_url', length: 500, nullable: true, comment: '缩略图 URL', default: null })
  thumbnailUrl!: string;

  @Column({ name: 'uploaded_by', type: 'int', comment: '上传管理员 ID' })
  uploadedBy!: number;

  @ManyToOne(() => AdminUserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by' })
  uploader!: AdminUserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
