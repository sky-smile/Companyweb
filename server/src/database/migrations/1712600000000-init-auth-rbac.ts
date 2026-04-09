import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitAuthRbac1712600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin_users',
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
            name: 'username',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'nickname',
            type: 'varchar',
            length: '50',
            default: "''",
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            default: "''",
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '30',
            default: "''",
          },
          {
            name: 'status',
            type: 'tinyint',
            width: 1,
            default: '1',
          },
          {
            name: 'is_super_admin',
            type: 'tinyint',
            width: 1,
            default: '0',
          },
          {
            name: 'last_login_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'last_login_ip',
            type: 'varchar',
            length: '64',
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
        name: 'roles',
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
            name: 'code',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'description',
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
        name: 'permissions',
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
            length: '100',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'module',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'action',
            type: 'varchar',
            length: '50',
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
        name: 'admin_user_roles',
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
            name: 'admin_user_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'role_id',
            type: 'bigint',
            unsigned: true,
          },
        ],
        indices: [
          new TableIndex({
            name: 'IDX_ADMIN_USER_ROLE_UNIQUE',
            columnNames: ['admin_user_id', 'role_id'],
            isUnique: true,
          }),
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'role_permissions',
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
            name: 'role_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'permission_id',
            type: 'bigint',
            unsigned: true,
          },
        ],
        indices: [
          new TableIndex({
            name: 'IDX_ROLE_PERMISSION_UNIQUE',
            columnNames: ['role_id', 'permission_id'],
            isUnique: true,
          }),
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('admin_user_roles', [
      new TableForeignKey({
        columnNames: ['admin_user_id'],
        referencedTableName: 'admin_users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);

    await queryRunner.createForeignKeys('role_permissions', [
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedTableName: 'permissions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_permissions', true);
    await queryRunner.dropTable('admin_user_roles', true);
    await queryRunner.dropTable('permissions', true);
    await queryRunner.dropTable('roles', true);
    await queryRunner.dropTable('admin_users', true);
  }
}
