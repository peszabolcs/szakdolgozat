// Vercel serverless entry — wraps the same Express app used in dev/Docker.
// The backend is compiled to server/dist/ at build time (see vercel.json
// `buildCommand`: vercel-build runs `npm run server:build && npm run build`),
// and we import from the compiled JS so Vercel's function bundler doesn't have
// to re-typecheck the server source tree.
//
// On Vercel the database runs in-memory and is reseeded on each cold start
// (see server/src/db/client.ts), which is acceptable for the demo MVP.
process.env.DB_MODE = 'memory';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createApp } = require('../server/dist/app');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDb } = require('../server/dist/db/client');

getDb();
const app = createApp();

export default app;
