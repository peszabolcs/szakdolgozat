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

describe('GET /api/forecast/:centerId', () => {
  it('returns 404 for unknown center', async () => {
    const res = await request(app).get('/api/forecast/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('returns a forecast envelope with default lookback', async () => {
    const db = getDb();
    const center = db.prepare('SELECT id, capacity FROM shopping_centers LIMIT 1').get() as
      | { id: string; capacity: number }
      | undefined;
    expect(center).toBeTruthy();
    const res = await request(app).get(`/api/forecast/${center!.id}`);
    expect(res.status).toBe(200);
    expect(res.body.centerId).toBe(center!.id);
    expect(Array.isArray(res.body.points)).toBe(true);
    expect(res.body.points.length).toBe(24);
    for (const p of res.body.points) {
      expect(p.predictedOccupancy).toBeGreaterThanOrEqual(0);
      expect(p.predictedOccupancy).toBeLessThanOrEqual(center!.capacity);
      expect(['low', 'medium', 'high']).toContain(p.confidence);
    }
  });

  it('rejects out-of-range hoursAhead with 400', async () => {
    const db = getDb();
    const center = db.prepare('SELECT id FROM shopping_centers LIMIT 1').get() as { id: string };
    const res = await request(app).get(`/api/forecast/${center.id}?hoursAhead=999`);
    expect(res.status).toBe(400);
  });

  it('honors hoursAhead parameter', async () => {
    const db = getDb();
    const center = db.prepare('SELECT id FROM shopping_centers LIMIT 1').get() as { id: string };
    const res = await request(app).get(`/api/forecast/${center.id}?hoursAhead=6`);
    expect(res.status).toBe(200);
    expect(res.body.points.length).toBe(6);
  });
});
