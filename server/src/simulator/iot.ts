import { getDb } from '../db/client';

const TICK_MS = Number(process.env.IOT_TICK_MS || 30_000);
let timer: NodeJS.Timeout | null = null;

function tick(): void {
  const db = getDb();
  const centers = db.prepare('SELECT id, capacity, occupied FROM shopping_centers').all() as Array<{
    id: string;
    capacity: number;
    occupied: number;
  }>;
  const update = db.prepare('UPDATE shopping_centers SET occupied = ?, updated_at = ? WHERE id = ?');
  const recordHistory = db.prepare(
    'INSERT INTO occupancy_history (center_id, occupied, capacity, recorded_at) VALUES (?, ?, ?, ?)'
  );
  const now = new Date().toISOString();
  for (const c of centers) {
    const delta = Math.floor((Math.random() - 0.5) * 12);
    const next = Math.max(0, Math.min(c.capacity, c.occupied + delta));
    update.run(next, now, c.id);
    recordHistory.run(c.id, next, c.capacity, now);
  }
}

export function startSimulator(): void {
  if (timer) return;
  timer = setInterval(tick, TICK_MS);
  // eslint-disable-next-line no-console
  console.log(`[iot] occupancy simulator started (tick ${TICK_MS}ms)`);
}

export function stopSimulator(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
