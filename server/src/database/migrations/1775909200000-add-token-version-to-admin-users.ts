import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTokenVersionToAdminUsers1775909200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'admin_users',
      new TableColumn({
        name: 'token_version',
        type: 'int',
        default: 0,
        comment: 'JWT Token 版本号，用于撤销已签发的 Token',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('admin_users', 'token_version');
  }
}
