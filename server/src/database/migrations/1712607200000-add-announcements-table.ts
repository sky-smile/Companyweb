import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddAnnouncementsTable1712607200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'announcements',
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
          },
          {
            name: 'summary',
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
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('announcements', true);
  }
}
