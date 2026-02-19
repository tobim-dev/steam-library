import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    // Admin-Seeder creates admin/admin user on startup.
    // Login to get JWT token for authenticated requests.
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(201);

    authToken = (loginRes.body as { access_token: string }).access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth API', () => {
    it('POST /api/auth/login - should login with default admin', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
        });
    });

    it('POST /api/auth/login - should reject wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrong' })
        .expect(401);
    });

    it('GET /api/auth/me - should return current user', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('username', 'admin');
          expect(res.body).toHaveProperty('role', 'admin');
          expect(res.body).not.toHaveProperty('passwordHash');
        });
    });

    it('GET /api/auth/me - should reject without token', () => {
      return request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });
  });

  describe('Settings API', () => {
    it('GET /api/settings - should return default settings', () => {
      return request(app.getHttpServer())
        .get('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('isConfigured', false);
        });
    });

    it('GET /api/settings - should reject without auth', () => {
      return request(app.getHttpServer()).get('/api/settings').expect(401);
    });
  });

  describe('Games API', () => {
    it('GET /api/games - should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(0);
        });
    });

    it('GET /api/games/:id - should return 404 for unknown game', () => {
      return request(app.getHttpServer())
        .get('/api/games/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('GET /api/games - should reject without auth', () => {
      return request(app.getHttpServer()).get('/api/games').expect(401);
    });
  });

  describe('Diary API', () => {
    it('GET /api/diary - should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/api/diary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(0);
        });
    });

    it('POST /api/diary - should reject invalid payload', () => {
      return request(app.getHttpServer())
        .post('/api/diary')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('Sync API', () => {
    it('POST /api/sync/steam - should fail without configuration', () => {
      return request(app.getHttpServer())
        .post('/api/sync/steam')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
        });
    });
  });

  describe('Admin API', () => {
    it('GET /api/admin/users - should return users list', () => {
      return request(app.getHttpServer())
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          const users = res.body as Array<{ username: string }>;
          expect(Array.isArray(users)).toBe(true);
          expect(users.length).toBeGreaterThanOrEqual(1);
          expect(users[0]).toHaveProperty('username', 'admin');
        });
    });
  });
});
