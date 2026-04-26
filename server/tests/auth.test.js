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
(0, vitest_1.describe)('POST /api/auth/login', () => {
    (0, vitest_1.it)('logs in a valid admin user and returns a JWT + user payload', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/auth/login')
            .send({ email: 'admin@parkvision.hu', password: 'admin123' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.token).toBeTruthy();
        (0, vitest_1.expect)(res.body.user).toMatchObject({
            email: 'admin@parkvision.hu',
            role: 'admin',
        });
    });
    (0, vitest_1.it)('rejects an unknown user with 401', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/auth/login')
            .send({ email: 'nobody@example.com', password: 'whatever' });
        (0, vitest_1.expect)(res.status).toBe(401);
    });
    (0, vitest_1.it)('rejects a wrong password with 401', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/auth/login')
            .send({ email: 'admin@parkvision.hu', password: 'WRONG' });
        (0, vitest_1.expect)(res.status).toBe(401);
    });
    (0, vitest_1.it)('rejects an invalid email format with 400', async () => {
        const res = await (0, supertest_1.default)(app).post('/api/auth/login').send({ email: 'not-an-email', password: 'x' });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
});
(0, vitest_1.describe)('GET /api/auth/me', () => {
    (0, vitest_1.it)('rejects when no token is supplied', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/auth/me');
        (0, vitest_1.expect)(res.status).toBe(401);
    });
    (0, vitest_1.it)('returns the user when a valid token is supplied', async () => {
        const login = await (0, supertest_1.default)(app)
            .post('/api/auth/login')
            .send({ email: 'admin@parkvision.hu', password: 'admin123' });
        const me = await (0, supertest_1.default)(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${login.body.token}`);
        (0, vitest_1.expect)(me.status).toBe(200);
        (0, vitest_1.expect)(me.body.user.email).toBe('admin@parkvision.hu');
    });
    (0, vitest_1.it)('rejects an invalid token with 401', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/auth/me').set('Authorization', 'Bearer not.a.real.token');
        (0, vitest_1.expect)(res.status).toBe(401);
    });
});
