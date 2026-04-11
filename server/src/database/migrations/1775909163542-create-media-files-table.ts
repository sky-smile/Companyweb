import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMediaFilesTable1775909163542 implements MigrationInterface {
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
            isNullable: false,
            comment: '原始文件名',
          },
          {
            name: 'filename',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '存储文件名',
          },
          {
            name: 'storage_path',
            type: 'varchar',
            length: '500',
            isNullable: false,
            comment: '存储路径（相对路径）',
          },
          {
            name: 'public_url',
            type: 'varchar',
            length: '500',
            isNullable: false,
            comment: '公开访问 URL',
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            isNullable: false,
            comment: 'MIME 类型',
          },
          {
            name: 'size',
            type: 'int',
            isNullable: false,
            comment: '文件大小（字节）',
          },
          {
            name: 'extension',
            type: 'varchar',
            length: '20',
            isNullable: false,
            comment: '文件扩展名',
          },
          {
            name: 'folder',
            type: 'varchar',
            length: '100',
            isNullable: true,
            default: null,
            comment: '上传目录',
          },
          {
            name: 'width',
            type: 'int',
            isNullable: true,
            default: null,
            comment: '图片宽度（仅图片文件）',
          },
          {
            name: 'height',
            type: 'int',
            isNullable: true,
            default: null,
            comment: '图片高度（仅图片文件）',
          },
          {
            name: 'thumbnail_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
            default: null,
            comment: '缩略图 URL',
          },
          {
            name: 'uploaded_by',
            type: 'int',
            isNullable: false,
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
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'media_files',
      new TableForeignKey({
        columnNames: ['uploaded_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admin_users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('media_files');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('uploaded_by') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('media_files', foreignKey);
    }
    await queryRunner.dropTable('media_files');
  }
}
