// Vercel serverless entry — wraps the same Express app used in dev/Docker.
// On Vercel the database runs in-memory and is reseeded on each cold start
// (see server/src/db/client.ts), which is acceptable for the demo MVP.
import { createApp } from '../server/src/app';
import { getDb } from '../server/src/db/client';

process.env.DB_MODE = 'memory';

getDb();
const app = createApp();

export default app;
