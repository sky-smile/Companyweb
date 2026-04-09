import 'reflect-metadata';
import { hashPassword } from '@/common/utils/password.util';
import AppDataSource from '../data-source';

const permissions = [
  ['View admin users', 'admin-users:view', 'admin-users', 'view'],
  ['Create admin users', 'admin-users:create', 'admin-users', 'create'],
  ['Update admin users', 'admin-users:update', 'admin-users', 'update'],
  ['Change admin status', 'admin-users:status', 'admin-users', 'status'],
  ['Reset admin password', 'admin-users:reset-password', 'admin-users', 'reset-password'],
  ['Change own password', 'admin-users:change-password', 'admin-users', 'change-password'],
  ['View roles', 'roles:view', 'roles', 'view'],
  ['Create roles', 'roles:create', 'roles', 'create'],
  ['Update roles', 'roles:update', 'roles', 'update'],
  ['Change role status', 'roles:status', 'roles', 'status'],
  ['View news', 'news:view', 'news', 'view'],
  ['Create news', 'news:create', 'news', 'create'],
  ['Update news', 'news:update', 'news', 'update'],
  ['Delete news', 'news:delete', 'news', 'delete'],
  ['View news categories', 'news-category:view', 'news-category', 'view'],
  ['Create news categories', 'news-category:create', 'news-category', 'create'],
  ['Update news categories', 'news-category:update', 'news-category', 'update'],
  ['Delete news categories', 'news-category:delete', 'news-category', 'delete'],
  ['View announcements', 'announcement:view', 'announcement', 'view'],
  ['Create announcements', 'announcement:create', 'announcement', 'create'],
  ['Update announcements', 'announcement:update', 'announcement', 'update'],
  ['Delete announcements', 'announcement:delete', 'announcement', 'delete'],
  ['View site pages', 'site-page:view', 'site-page', 'view'],
  ['Update site pages', 'site-page:update', 'site-page', 'update'],
  ['View site settings', 'site-setting:view', 'site-setting', 'view'],
  ['Update site settings', 'site-setting:update', 'site-setting', 'update'],
  ['View banners', 'banner:view', 'banner', 'view'],
  ['Create banners', 'banner:create', 'banner', 'create'],
  ['Update banners', 'banner:update', 'banner', 'update'],
  ['Delete banners', 'banner:delete', 'banner', 'delete'],
  ['Upload images', 'upload:image', 'upload', 'image'],
  ['Upload files', 'upload:file', 'upload', 'file'],
];

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.manager.query(
      'INSERT INTO roles (name, code, description, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), status = VALUES(status)',
      ['Super Admin', 'super-admin', 'Full access role for system bootstrapping', 1],
    );

    for (const permission of permissions) {
      await queryRunner.manager.query(
        'INSERT INTO permissions (name, code, module, action) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), module = VALUES(module), action = VALUES(action)',
        permission,
      );
    }

    const roleRows = (await queryRunner.manager.query(
      'SELECT id FROM roles WHERE code = ? LIMIT 1',
      ['super-admin'],
    )) as Array<{ id: string }>;

    const roleId = roleRows[0]?.id;

    if (roleId === undefined) {
      throw new Error('Failed to resolve super-admin role id');
    }

    const placeholders = permissions.map(() => '?').join(', ');
    const permissionCodes = permissions.map((item) => item[1]);
    const permissionRows = (await queryRunner.manager.query(
      'SELECT id FROM permissions WHERE code IN (' + placeholders + ')',
      permissionCodes,
    )) as Array<{ id: string }>;

    for (const permissionRow of permissionRows) {
      await queryRunner.manager.query(
        'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
        [roleId, permissionRow.id],
      );
    }

    const passwordHash = await hashPassword('Admin123456');

    await queryRunner.manager.query(
      'INSERT INTO admin_users (username, password_hash, nickname, status, is_super_admin) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), nickname = VALUES(nickname), status = VALUES(status), is_super_admin = VALUES(is_super_admin)',
      ['admin', passwordHash, 'Super Admin', 1, 1],
    );

    const userRows = (await queryRunner.manager.query(
      'SELECT id FROM admin_users WHERE username = ? LIMIT 1',
      ['admin'],
    )) as Array<{ id: string }>;

    const userId = userRows[0]?.id;

    if (userId === undefined) {
      throw new Error('Failed to resolve admin user id');
    }

    await queryRunner.manager.query(
      'INSERT IGNORE INTO admin_user_roles (admin_user_id, role_id) VALUES (?, ?)',
      [userId, roleId],
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

void seed();
