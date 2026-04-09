import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddSiteContentTables1712610800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'site_pages',
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
            name: 'page_key',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '150',
            default: "''",
          },
          {
            name: 'content',
            type: 'longtext',
            default: "''",
          },
          {
            name: 'extra_json',
            type: 'longtext',
            default: "''",
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
            name: 'status',
            type: 'tinyint',
            width: 1,
            default: '1',
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
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'site_settings',
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
            name: 'setting_key',
            type: 'varchar',
            length: '80',
            isUnique: true,
          },
          {
            name: 'setting_value',
            type: 'longtext',
            default: "''",
          },
          {
            name: 'setting_group',
            type: 'varchar',
            length: '50',
            default: "'general'",
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            default: "''",
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
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'banners',
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
            name: 'title',
            type: 'varchar',
            length: '150',
            default: "''",
          },
          {
            name: 'subtitle',
            type: 'varchar',
            length: '255',
            default: "''",
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'link_url',
            type: 'varchar',
            length: '255',
            default: "''",
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('banners', true);
    await queryRunner.dropTable('site_settings', true);
    await queryRunner.dropTable('site_pages', true);
  }
}
