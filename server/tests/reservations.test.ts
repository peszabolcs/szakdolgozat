import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
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

async function loginAsAdmin(): Promise<string> {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@parkvision.hu', password: 'admin123' });
  return res.body.token as string;
}

function inTwoHours(): { start: string; end: string } {
  const start = new Date(Date.now() + 2 * 60 * 60 * 1000);
  start.setMinutes(0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

describe('GET /api/shopping-centers', () => {
  it('returns the seeded centers', async () => {
    const res = await request(app).get('/api/shopping-centers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('capacity');
  });
});

describe('Reservations CRUD', () => {
  let token = '';
  beforeEach(async () => {
    token = await loginAsAdmin();
    // Reset reservations between tests for isolation.
    getDb().exec('DELETE FROM reservations');
  });

  it('rejects unauthenticated GET with 401', async () => {
    const res = await request(app).get('/api/reservations');
    expect(res.status).toBe(401);
  });

  it('creates a reservation and lists it', async () => {
    const slot = inTwoHours();
    const create = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({ centerId: 'sc-1', slotStart: slot.start, slotEnd: slot.end });
    expect(create.status).toBe(201);
    expect(create.body.status).toBe('active');
    expect(create.body.centerId).toBe('sc-1');

    const list = await request(app).get('/api/reservations').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });

  it('rejects a past reservation with 422 and code "past"', async () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    const end = new Date(Date.now() - 1000).toISOString();
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({ centerId: 'sc-1', slotStart: past, slotEnd: end });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('past');
  });

  it('rejects a duplicate reservation with 409 and code "duplicate"', async () => {
    const slot = inTwoHours();
    await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({ centerId: 'sc-2', slotStart: slot.start, slotEnd: slot.end });
    const dup = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({ centerId: 'sc-2', slotStart: slot.start, slotEnd: slot.end });
    expect(dup.status).toBe(409);
    expect(dup.body.code).toBe('duplicate');
  });

  it('cancels a reservation and marks it cancelled', async () => {
    const slot = inTwoHours();
    const create = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({ centerId: 'sc-3', slotStart: slot.start, slotEnd: slot.end });
    const id = create.body.id;
    const cancel = await request(app)
      .delete(`/api/reservations/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(cancel.status).toBe(200);
    expect(cancel.body.status).toBe('cancelled');
  });
});

describe('GET /api/dashboard/stats', () => {
  it('returns aggregate KPIs', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalCenters');
    expect(res.body).toHaveProperty('totalCapacity');
    expect(res.body).toHaveProperty('averageOccupancy');
    expect(res.body.totalCenters).toBeGreaterThan(0);
  });
});
