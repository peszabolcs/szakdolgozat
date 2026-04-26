import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { getDb, resetDb } from '../src/db/client';

beforeAll(() => {
  process.env.DB_MODE = 'memory';
  process.env.JWT_SECRET = 'test-secret';
  resetDb();
  getDb();
});

afterAll(() => {
  resetDb();
});

const app = createApp();

describe('POST /api/auth/login', () => {
  it('logs in a valid admin user and returns a JWT + user payload', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@parkvision.hu', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toMatchObject({
      email: 'admin@parkvision.hu',
      role: 'admin',
    });
  });

  it('rejects an unknown user with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'whatever' });
    expect(res.status).toBe(401);
  });

  it('rejects a wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@parkvision.hu', password: 'WRONG' });
    expect(res.status).toBe(401);
  });

  it('rejects an invalid email format with 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email', password: 'x' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('rejects when no token is supplied', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns the user when a valid token is supplied', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@parkvision.hu', password: 'admin123' });
    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe('admin@parkvision.hu');
  });

  it('rejects an invalid token with 401', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not.a.real.token');
    expect(res.status).toBe(401);
  });
});
