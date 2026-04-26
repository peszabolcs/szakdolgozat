import { createApp } from './app';
import { getDb } from './db/client';
import { startSimulator } from './simulator/iot';

const PORT = Number(process.env.PORT || 3001);

getDb();
startSimulator();

const app = createApp();
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[parkvision-api] listening on http://localhost:${PORT}`);
});
