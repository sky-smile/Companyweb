import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import * as fs from 'node:fs';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { hashPassword } from '../src/common/utils/password.util';

process.env.DB_HOST = process.env.DB_HOST ?? '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT ?? '3306';
process.env.DB_NAME = process.env.DB_NAME ?? 'company_web';
process.env.DB_USER = process.env.DB_USER ?? 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? '';
process.env.DB_TYPE = process.env.DB_TYPE ?? 'mariadb';
process.env.UPLOAD_DIR = process.env.UPLOAD_DIR ?? 'uploads-test';
process.env.UPLOAD_BASE_URL = process.env.UPLOAD_BASE_URL ?? '/uploads';

describe('HealthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = app.get(DataSource);
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();

    await dataSource.query('DELETE FROM admin_user_roles WHERE admin_user_id <> 1');
    await dataSource.query('DELETE FROM admin_users WHERE username <> ?', ['admin']);
    await dataSource.query('DELETE FROM announcements');
    await dataSource.query('DELETE FROM banners');
    await dataSource.query('DELETE FROM site_settings');
    await dataSource.query('DELETE FROM site_pages');
    await dataSource.query('DELETE FROM news');
    await dataSource.query('DELETE FROM news_categories');
    await dataSource.query('DELETE FROM products');
    await dataSource.query('DELETE FROM product_categories');
    fs.rmSync(process.env.UPLOAD_DIR!, { recursive: true, force: true });
    await dataSource.query('DELETE FROM role_permissions WHERE role_id <> 1');
    await dataSource.query('DELETE FROM roles WHERE code <> ?', ['super-admin']);
    const adminPasswordHash = await hashPassword('Admin123456');
    await dataSource.query(
      'UPDATE admin_users SET password_hash = ? WHERE username = ?',
      [adminPasswordHash, 'admin'],
    );

    const permissionRows = await dataSource.query(
      'SELECT id FROM permissions WHERE code IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'admin-users:view',
        'admin-users:create',
        'admin-users:update',
        'admin-users:status',
        'admin-users:reset-password',
        'admin-users:change-password',
        'roles:view',
        'roles:create',
        'roles:update',
        'roles:status',
        'news:view',
        'news:create',
        'news:update',
        'news:delete',
        'news-category:view',
        'news-category:create',
        'news-category:update',
        'news-category:delete',
        'announcement:view',
        'announcement:create',
        'announcement:update',
        'announcement:delete',
        'site-page:view',
        'site-page:update',
        'site-setting:view',
        'site-setting:update',
        'banner:view',
        'banner:create',
        'banner:update',
        'banner:delete',
        'upload:image',
        'upload:file',
        'product-category:view',
        'product-category:create',
        'product-category:update',
        'product-category:delete',
        'product:view',
        'product:create',
        'product:update',
        'product:delete',
      ],
    );

    await dataSource.query('DELETE FROM role_permissions WHERE role_id = 1');

    for (const permissionRow of permissionRows as Array<{ id: string }>) {
      await dataSource.query(
        'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
        ['1', permissionRow.id],
      );
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.message).toBe('ok');
        expect(body.data.status).toBe('ok');
      });
  });

  it('/api/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'Admin123456',
      })
      .expect(201);

    expect(response.body.code).toBe(0);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
    expect(response.body.data.profile.username).toBe('admin');

    accessToken = response.body.data.accessToken as string;
  });

  it('/api/auth/profile (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.username).toBe('admin');
        expect(body.data.roles).toContain('super-admin');
      });
  });

  it('/api/admin-users (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/admin-users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.list).toHaveLength(1);
        expect(body.data.pagination.total).toBe(1);
      });
  });

  it('/api/admin-users (POST)', async () => {
    await request(app.getHttpServer())
      .post('/api/admin-users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        username: 'editor',
        password: 'Editor123456',
        nickname: 'Editor User',
        roleIds: [],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.username).toBe('editor');
      });
  });

  it('/api/roles (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/roles')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('/api/roles/permissions (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/roles/permissions')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('/api/roles (POST)', async () => {
    await request(app.getHttpServer())
      .post('/api/roles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Editor',
        code: 'editor',
        description: 'Editor role',
        permissionIds: [],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.code).toBe('editor');
      });
  });

  it('/api/admin-users (POST) rejects duplicate username', async () => {
    await request(app.getHttpServer())
      .post('/api/admin-users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        username: 'editor',
        password: 'Editor123456',
        nickname: 'Duplicate Editor',
        roleIds: [],
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toContain('Username already exists');
      });
  });

  it('/api/admin-users (POST) rejects invalid role ids', async () => {
    await request(app.getHttpServer())
      .post('/api/admin-users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        username: 'viewer',
        password: 'Viewer123456',
        nickname: 'Viewer User',
        roleIds: ['999999'],
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toContain('One or more roles do not exist');
      });
  });

  it('/api/admin-users/change-password (POST)', async () => {
    await request(app.getHttpServer())
      .post('/api/admin-users/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword: 'Admin123456',
        newPassword: 'Admin1234567',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.success).toBe(true);
      });
  });

  it('/api/auth/login (POST) accepts updated password', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'Admin1234567',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.accessToken).toBeDefined();
      });
  });

  it('/api/admin/news-categories (POST)', async () => {
    await request(app.getHttpServer())
      .post('/api/admin/news-categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Company News',
        slug: 'company-news',
        sort: 1,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.slug).toBe('company-news');
      });
  });

  it('/api/admin/news (POST)', async () => {
    const categoryRows = (await dataSource.query(
      'SELECT id FROM news_categories WHERE slug = ?',
      ['company-news'],
    )) as Array<{ id: string }>;

    await request(app.getHttpServer())
      .post('/api/admin/news')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        categoryId: categoryRows[0].id,
        title: 'New Product Launch',
        slug: 'new-product-launch',
        summary: 'Launch summary',
        content: 'Detailed launch content',
        status: 1,
        isTop: 1,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.slug).toBe('new-product-launch');
      });
  });

  it('/api/admin/news (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/admin/news')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.list.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('/api/public/news (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/public/news')
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.list.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('/api/public/news/:id (GET)', async () => {
    const newsRows = (await dataSource.query(
      'SELECT id FROM news WHERE slug = ?',
      ['new-product-launch'],
    )) as Array<{ id: string }>;

    await request(app.getHttpServer())
      .get(`/api/public/news/${newsRows[0].id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.slug).toBe('new-product-launch');
      });
  });

  it('/api/admin/news-categories/:id (PATCH)', async () => {
    const categoryRows = (await dataSource.query(
      'SELECT id FROM news_categories WHERE slug = ?',
      ['company-news'],
    )) as Array<{ id: string }>;

    await request(app.getHttpServer())
      .patch(`/api/admin/news-categories/${categoryRows[0].id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Corporate News',
        slug: 'corporate-news',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.slug).toBe('corporate-news');
      });
  });

  it('/api/admin/news/:id (DELETE)', async () => {
    const newsRows = (await dataSource.query(
      'SELECT id FROM news WHERE slug = ?',
      ['new-product-launch'],
    )) as Array<{ id: string }>;

    await request(app.getHttpServer())
      .delete(`/api/admin/news/${newsRows[0].id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
      });
  });

  it('/api/admin/news-categories/:id (DELETE)', async () => {
    const categoryRows = (await dataSource.query(
      'SELECT id FROM news_categories WHERE slug = ?',
      ['corporate-news'],
    )) as Array<{ id: string }>;

    await request(app.getHttpServer())
      .delete(`/api/admin/news-categories/${categoryRows[0].id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
      });
  });

  it('/api/admin/announcements (POST)', async () => {
    await request(app.getHttpServer())
      .post('/api/admin/announcements')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Holiday Notice',
        summary: 'Office holiday summary',
        content: 'Office holiday detailed notice',
        status: 1,
        isTop: 1,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.title).toBe('Holiday Notice');
      });
  });

  it('/api/admin/announcements (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/admin/announcements')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.list.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('/api/public/announcements (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/public/announcements')
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.list.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('/api/public/announcements/:id (GET)', async () => {
    const rows = (await dataSource.query(
      'SELECT id FROM announcements WHERE title = ?',
      ['Holiday Notice'],
    )) as Array<{ id: string }>;

    await request(app.getHttpServer())
      .get(`/api/public/announcements/${rows[0].id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.title).toBe('Holiday Notice');
      });
  });

  it('/api/admin/announcements/:id (PATCH)', async () => {
    const rows = (await dataSource.query(
      'SELECT id FROM announcements WHERE title = ?',
      ['Holiday Notice'],
    )) as Array<{ id: string }>;

    await request(app.getHttpServer())
      .patch(`/api/admin/announcements/${rows[0].id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated Holiday Notice',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.title).toBe('Updated Holiday Notice');
      });
  });

  it('/api/admin/announcements/:id (DELETE)', async () => {
    const rows = (await dataSource.query(
      'SELECT id FROM announcements WHERE title = ?',
      ['Updated Holiday Notice'],
    )) as Array<{ id: string }>;

    await request(app.getHttpServer())
      .delete(`/api/admin/announcements/${rows[0].id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
      });
  });

  it('/api/admin/site-pages/:key (PUT)', async () => {
    await request(app.getHttpServer())
      .put('/api/admin/site-pages/home')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Home Page',
        content: 'Home content block',
        extraJson: '{"hero":"Company Hero"}',
        seoTitle: 'Home SEO',
        seoDescription: 'Home SEO description',
        status: 1,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.pageKey).toBe('home');
      });
  });

  it('/api/admin/site-settings (PUT)', async () => {
    await request(app.getHttpServer())
      .put('/api/admin/site-settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        items: [
          {
            settingKey: 'companyName',
            settingValue: 'Sky Smile',
            settingGroup: 'company',
            description: 'Company display name',
          },
        ],
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('/api/admin/banners (POST)', async () => {
    await request(app.getHttpServer())
      .post('/api/admin/banners')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Main Banner',
        subtitle: 'Primary homepage banner',
        imageUrl: '/uploads/banner-home.jpg',
        linkUrl: '/products',
        sort: 1,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.title).toBe('Main Banner');
      });
  });

  it('/api/public/home (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/public/home')
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.page.pageKey).toBe('home');
        expect(body.data.banners.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('/api/public/about (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/public/about')
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.pageKey).toBe('about');
      });
  });

  it('/api/public/contact (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/public/contact')
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.page.pageKey).toBe('contact');
      });
  });

  it('/api/admin/upload/image (POST)', async () => {
    await request(app.getHttpServer())
      .post('/api/admin/upload/image?folder=banners')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from('fake-image-content'), {
        filename: 'banner.png',
        contentType: 'image/png',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.publicUrl).toContain('/uploads/banners/');
      });
  });

  it('/api/admin/upload/file (POST)', async () => {
    await request(app.getHttpServer())
      .post('/api/admin/upload/file?folder=docs')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from('plain-text-file'), {
        filename: 'manual.txt',
        contentType: 'text/plain',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.publicUrl).toContain('/uploads/docs/');
      });
  });

  it('/api/admin/product-categories (POST)', async () => {
    await request(app.getHttpServer())
      .post('/api/admin/product-categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Industrial Equipment',
        slug: 'industrial-equipment',
        sort: 1,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.slug).toBe('industrial-equipment');
      });
  });

  it('/api/admin/products (POST)', async () => {
    const categoryRows = (await dataSource.query(
      'SELECT id FROM product_categories WHERE slug = ?',
      ['industrial-equipment'],
    )) as Array<{ id: string }>;

    await request(app.getHttpServer())
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        categoryId: categoryRows[0].id,
        name: 'Hydraulic Press',
        slug: 'hydraulic-press',
        summary: 'Industrial hydraulic press',
        content: 'Detailed product description',
        imagesJson: '["/uploads/products/press-1.jpg"]',
        parametersJson: '{"power":"20T"}',
        status: 1,
        sort: 1,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.slug).toBe('hydraulic-press');
      });
  });

  it('/api/public/products (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/public/products')
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.list.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('/api/public/products/:id (GET)', async () => {
    const rows = (await dataSource.query(
      'SELECT id FROM products WHERE slug = ?',
      ['hydraulic-press'],
    )) as Array<{ id: string }>;

    await request(app.getHttpServer())
      .get(`/api/public/products/${rows[0].id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(0);
        expect(body.data.slug).toBe('hydraulic-press');
      });
  });
});
