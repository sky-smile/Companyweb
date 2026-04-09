import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { hashPassword } from '../src/common/utils/password.util';

process.env.DB_HOST = process.env.DB_HOST ?? '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT ?? '3307';
process.env.DB_NAME = process.env.DB_NAME ?? 'company_web';
process.env.DB_USER = process.env.DB_USER ?? 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? '';
process.env.DB_TYPE = process.env.DB_TYPE ?? 'mariadb';

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
    await dataSource.query('DELETE FROM role_permissions WHERE role_id <> 1');
    await dataSource.query('DELETE FROM roles WHERE code <> ?', ['super-admin']);
    const adminPasswordHash = await hashPassword('Admin123456');
    await dataSource.query(
      'UPDATE admin_users SET password_hash = ? WHERE username = ?',
      [adminPasswordHash, 'admin'],
    );
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
});
