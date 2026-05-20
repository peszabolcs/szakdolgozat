import { Router, type Request, type Response } from 'express';
import { occupancyBus } from '../realtime/eventBus';
import { getDb } from '../db/client';

const router = Router();

const HEARTBEAT_MS = 25_000;

router.get('/occupancy', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const writeEvent = (event: string, payload: unknown) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  // Initial snapshot from current DB state so the client sees something immediately.
  try {
    const db = getDb();
    const centers = db.prepare('SELECT id, capacity, occupied, updated_at FROM shopping_centers').all() as Array<{
      id: string;
      capacity: number;
      occupied: number;
      updated_at: string;
    }>;
    writeEvent('snapshot', {
      centers: centers.map((c) => ({
        centerId: c.id,
        capacity: c.capacity,
        occupied: c.occupied,
        ratio: c.capacity > 0 ? c.occupied / c.capacity : 0,
        recordedAt: c.updated_at,
      })),
      recordedAt: new Date().toISOString(),
    });
  } catch {
    // ignore — the bus will emit fresh data on the next tick
  }

  const unsubscribe = occupancyBus.onSnapshot((snapshot) => {
    writeEvent('snapshot', snapshot);
  });

  const heartbeat = setInterval(() => {
    res.write(`: heartbeat ${Date.now()}\n\n`);
  }, HEARTBEAT_MS);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
    res.end();
  });
});

export default router;
