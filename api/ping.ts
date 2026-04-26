// Minimal serverless smoke test — bypasses the entire backend.
// api/package.json declares "type": "commonjs", so this file uses CJS syntax.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('node:fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('node:path');

interface PingResponse {
  status: (code: number) => { json: (data: unknown) => void };
}

module.exports = function handler(_req: unknown, res: PingResponse) {
  const distPath = path.resolve(process.cwd(), 'server/dist/app.js');
  const requireTry: Record<string, string> = {};
  for (const mod of ['express', 'better-sqlite3', 'jsonwebtoken', 'bcryptjs', 'zod', '../server/dist/app.js']) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require(mod);
      requireTry[mod] = 'ok';
    } catch (err) {
      requireTry[mod] = (err as Error).message;
    }
  }
  res.status(200).json({
    pong: true,
    time: new Date().toISOString(),
    cwd: process.cwd(),
    nodeVersion: process.version,
    serverDistExists: fs.existsSync(distPath),
    serverDistFiles: fs.existsSync(path.dirname(distPath))
      ? fs.readdirSync(path.dirname(distPath))
      : [],
    requireTry,
  });
};
