import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixMediaFilesPublicUrls1776800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 将 public_url 从绝对路径改为相对路径
    await queryRunner.query(
      `UPDATE media_files
       SET public_url = REPLACE(public_url, 'http://localhost:4000/uploads', '/uploads')
       WHERE public_url LIKE 'http://localhost:4000/uploads/%'`,
    );
    await queryRunner.query(
      `UPDATE media_files
       SET public_url = REPLACE(public_url, 'http://localhost:3000/uploads', '/uploads')
       WHERE public_url LIKE 'http://localhost:3000/uploads/%'`,
    );

    // 同样处理缩略图 URL
    await queryRunner.query(
      `UPDATE media_files
       SET thumbnail_url = REPLACE(thumbnail_url, 'http://localhost:4000/uploads', '/uploads')
       WHERE thumbnail_url LIKE 'http://localhost:4000/uploads/%'`,
    );
    await queryRunner.query(
      `UPDATE media_files
       SET thumbnail_url = REPLACE(thumbnail_url, 'http://localhost:3000/uploads', '/uploads')
       WHERE thumbnail_url LIKE 'http://localhost:3000/uploads/%'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 回退：将相对路径还原为绝对路径
    await queryRunner.query(
      `UPDATE media_files
       SET public_url = REPLACE(public_url, '/uploads', 'http://localhost:4000/uploads')
       WHERE public_url LIKE '/uploads/%' AND public_url NOT LIKE 'http://%'`,
    );
    await queryRunner.query(
      `UPDATE media_files
       SET thumbnail_url = REPLACE(thumbnail_url, '/uploads', 'http://localhost:4000/uploads')
       WHERE thumbnail_url LIKE '/uploads/%' AND thumbnail_url NOT LIKE 'http://%'`,
    );
  }
}
