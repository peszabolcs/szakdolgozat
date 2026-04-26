"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const client_1 = require("../src/db/client");
(0, vitest_1.beforeAll)(() => {
    process.env.DB_MODE = 'memory';
    process.env.JWT_SECRET = 'test-secret';
    (0, client_1.resetDb)();
    (0, client_1.getDb)();
});
(0, vitest_1.afterAll)(() => {
    (0, client_1.resetDb)();
});
const app = (0, app_1.createApp)();
async function loginAsAdmin() {
    const res = await (0, supertest_1.default)(app)
        .post('/api/auth/login')
        .send({ email: 'admin@parkvision.hu', password: 'admin123' });
    return res.body.token;
}
function inTwoHours() {
    const start = new Date(Date.now() + 2 * 60 * 60 * 1000);
    start.setMinutes(0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return { start: start.toISOString(), end: end.toISOString() };
}
(0, vitest_1.describe)('GET /api/shopping-centers', () => {
    (0, vitest_1.it)('returns the seeded centers', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/shopping-centers');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(res.body)).toBe(true);
        (0, vitest_1.expect)(res.body.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(res.body[0]).toHaveProperty('name');
        (0, vitest_1.expect)(res.body[0]).toHaveProperty('capacity');
    });
});
(0, vitest_1.describe)('Reservations CRUD', () => {
    let token = '';
    (0, vitest_1.beforeEach)(async () => {
        token = await loginAsAdmin();
        // Reset reservations between tests for isolation.
        (0, client_1.getDb)().exec('DELETE FROM reservations');
    });
    (0, vitest_1.it)('rejects unauthenticated GET with 401', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/reservations');
        (0, vitest_1.expect)(res.status).toBe(401);
    });
    (0, vitest_1.it)('creates a reservation and lists it', async () => {
        const slot = inTwoHours();
        const create = await (0, supertest_1.default)(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send({ centerId: 'sc-1', slotStart: slot.start, slotEnd: slot.end });
        (0, vitest_1.expect)(create.status).toBe(201);
        (0, vitest_1.expect)(create.body.status).toBe('active');
        (0, vitest_1.expect)(create.body.centerId).toBe('sc-1');
        const list = await (0, supertest_1.default)(app).get('/api/reservations').set('Authorization', `Bearer ${token}`);
        (0, vitest_1.expect)(list.status).toBe(200);
        (0, vitest_1.expect)(list.body).toHaveLength(1);
    });
    (0, vitest_1.it)('rejects a past reservation with 422 and code "past"', async () => {
        const past = new Date(Date.now() - 60_000).toISOString();
        const end = new Date(Date.now() - 1000).toISOString();
        const res = await (0, supertest_1.default)(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send({ centerId: 'sc-1', slotStart: past, slotEnd: end });
        (0, vitest_1.expect)(res.status).toBe(422);
        (0, vitest_1.expect)(res.body.code).toBe('past');
    });
    (0, vitest_1.it)('rejects a duplicate reservation with 409 and code "duplicate"', async () => {
        const slot = inTwoHours();
        await (0, supertest_1.default)(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send({ centerId: 'sc-2', slotStart: slot.start, slotEnd: slot.end });
        const dup = await (0, supertest_1.default)(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send({ centerId: 'sc-2', slotStart: slot.start, slotEnd: slot.end });
        (0, vitest_1.expect)(dup.status).toBe(409);
        (0, vitest_1.expect)(dup.body.code).toBe('duplicate');
    });
    (0, vitest_1.it)('cancels a reservation and marks it cancelled', async () => {
        const slot = inTwoHours();
        const create = await (0, supertest_1.default)(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send({ centerId: 'sc-3', slotStart: slot.start, slotEnd: slot.end });
        const id = create.body.id;
        const cancel = await (0, supertest_1.default)(app)
            .delete(`/api/reservations/${id}`)
            .set('Authorization', `Bearer ${token}`);
        (0, vitest_1.expect)(cancel.status).toBe(200);
        (0, vitest_1.expect)(cancel.body.status).toBe('cancelled');
    });
});
(0, vitest_1.describe)('GET /api/dashboard/stats', () => {
    (0, vitest_1.it)('returns aggregate KPIs', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/dashboard/stats');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('totalCenters');
        (0, vitest_1.expect)(res.body).toHaveProperty('totalCapacity');
        (0, vitest_1.expect)(res.body).toHaveProperty('averageOccupancy');
        (0, vitest_1.expect)(res.body.totalCenters).toBeGreaterThan(0);
    });
});
