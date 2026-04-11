import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AddMediaFilesTable1712620000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'media_files',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'original_name',
            type: 'varchar',
            length: '255',
            comment: '原始文件名',
          },
          {
            name: 'filename',
            type: 'varchar',
            length: '255',
            comment: '存储文件名',
          },
          {
            name: 'storage_path',
            type: 'varchar',
            length: '500',
            comment: '存储路径（相对路径）',
          },
          {
            name: 'public_url',
            type: 'varchar',
            length: '500',
            comment: '公开访问 URL',
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            comment: 'MIME 类型',
          },
          {
            name: 'size',
            type: 'int',
            comment: '文件大小（字节）',
          },
          {
            name: 'extension',
            type: 'varchar',
            length: '20',
            comment: '文件扩展名',
          },
          {
            name: 'folder',
            type: 'varchar',
            length: '100',
            isNullable: true,
            comment: '上传目录',
          },
          {
            name: 'width',
            type: 'int',
            isNullable: true,
            comment: '图片宽度（仅图片文件）',
          },
          {
            name: 'height',
            type: 'int',
            isNullable: true,
            comment: '图片高度（仅图片文件）',
          },
          {
            name: 'thumbnail_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
            comment: '缩略图 URL',
          },
          {
            name: 'uploaded_by',
            type: 'int',
            comment: '上传管理员 ID',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        comment: '媒体文件管理表',
      }),
      true,
    );

    // 添加索引
    await queryRunner.createIndex(
      'media_files',
      new TableIndex({
        name: 'IDX_MEDIA_FOLDER',
        columnNames: ['folder'],
      }),
    );

    await queryRunner.createIndex(
      'media_files',
      new TableIndex({
        name: 'IDX_MEDIA_MIME_TYPE',
        columnNames: ['mime_type'],
      }),
    );

    await queryRunner.createIndex(
      'media_files',
      new TableIndex({
        name: 'IDX_MEDIA_UPLOADED_BY',
        columnNames: ['uploaded_by'],
      }),
    );

    await queryRunner.createIndex(
      'media_files',
      new TableIndex({
        name: 'IDX_MEDIA_CREATED_AT',
        columnNames: ['created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('media_files');
  }
}
