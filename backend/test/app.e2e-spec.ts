import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Settings API', () => {
    it('GET /api/settings - should return default settings', () => {
      return request(app.getHttpServer())
        .get('/api/settings')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('isConfigured', false);
          expect(res.body).toHaveProperty('steamApiKey', null);
          expect(res.body).toHaveProperty('steamId', null);
        });
    });

    it('PUT /api/settings - should update Steam ID', () => {
      return request(app.getHttpServer())
        .put('/api/settings')
        .send({ steamId: '76561198012345678' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('steamId', '76561198012345678');
        });
    });
  });

  describe('Games API', () => {
    it('GET /api/games - should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/api/games')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(0);
        });
    });

    it('GET /api/games/:id - should return 404 for unknown game', () => {
      return request(app.getHttpServer())
        .get('/api/games/nonexistent-id')
        .expect(404);
    });
  });

  describe('Diary API', () => {
    it('GET /api/diary - should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/api/diary')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(0);
        });
    });

    it('POST /api/diary - should reject invalid payload', () => {
      return request(app.getHttpServer())
        .post('/api/diary')
        .send({})
        .expect(400);
    });
  });

  describe('Sync API', () => {
    it('POST /api/sync/steam - should fail without configuration', () => {
      return request(app.getHttpServer())
        .post('/api/sync/steam')
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
        });
    });
  });
});
