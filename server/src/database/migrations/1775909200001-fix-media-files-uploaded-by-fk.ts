import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class FixMediaFilesUploadedByFk1775909200001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 将 uploaded_by 列改为 bigint unsigned nullable，与 admin_users.id 类型一致
    await queryRunner.query(
      'ALTER TABLE media_files MODIFY uploaded_by BIGINT UNSIGNED NULL',
    );

    // 添加外键约束：删除管理员时上传记录保留，uploaded_by 置为 NULL
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
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('uploaded_by') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('media_files', foreignKey);
    }
    await queryRunner.query(
      'ALTER TABLE media_files MODIFY uploaded_by BIGINT UNSIGNED NOT NULL',
    );
  }
}
