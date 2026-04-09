import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class AddProductTables1712614400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_categories',
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
            length: '80',
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '100',
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
        name: 'products',
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
            name: 'name',
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
            name: 'content',
            type: 'longtext',
            default: "''",
          },
          {
            name: 'images_json',
            type: 'longtext',
            default: "''",
          },
          {
            name: 'parameters_json',
            type: 'longtext',
            default: "''",
          },
          {
            name: 'status',
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
            name: 'sort',
            type: 'int',
            default: '0',
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
            name: 'IDX_PRODUCTS_CATEGORY_ID',
            columnNames: ['category_id'],
          }),
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'product_categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products', true);
    await queryRunner.dropTable('product_categories', true);
  }
}
