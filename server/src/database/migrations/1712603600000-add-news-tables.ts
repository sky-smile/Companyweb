import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class AddNewsTables1712603600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'news_categories',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '80',
            isUnique: true,
          },
          {
            name: 'sort',
            type: 'int',
            default: '0',
          },
          {
            name: 'status',
            type: 'tinyint',
            width: 1,
            default: '1',
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'news',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'category_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '180',
            isUnique: true,
          },
          {
            name: 'summary',
            type: 'varchar',
            length: '255',
            default: "''",
          },
          {
            name: 'cover_image',
            type: 'varchar',
            length: '255',
            default: "''",
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'status',
            type: 'tinyint',
            width: 1,
            default: '0',
          },
          {
            name: 'is_top',
            type: 'tinyint',
            width: 1,
            default: '0',
          },
          {
            name: 'published_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'seo_title',
            type: 'varchar',
            length: '180',
            default: "''",
          },
          {
            name: 'seo_description',
            type: 'varchar',
            length: '255',
            default: "''",
          },
          {
            name: 'created_by',
            type: 'bigint',
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'bigint',
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          new TableIndex({
            name: 'IDX_NEWS_CATEGORY_ID',
            columnNames: ['category_id'],
          }),
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'news',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'news_categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('news', true);
    await queryRunner.dropTable('news_categories', true);
  }
}
