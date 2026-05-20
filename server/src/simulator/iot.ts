import { getDb } from '../db/client';
import { occupancyBus, OccupancyUpdate } from '../realtime/eventBus';

const TICK_MS = Number(process.env.IOT_TICK_MS || 30_000);
let timer: NodeJS.Timeout | null = null;

// Mean-reversion targets keep the simulator from drifting to 0 or capacity
// during a long run of unfavourable random deltas. Each center has a baseline
// "usual" occupancy ratio that the random walk gravitates back to.
const TARGET_RATIO: Record<string, number> = {
  'sc-1': 0.78, // Westend
  'sc-2': 0.72, // Aréna Mall
  'sc-3': 0.68, // Allee
  'sc-4': 0.80, // MOM Park
  'sc-5': 0.72, // Mammut
  'sc-6': 0.74, // Duna Plaza
  'sc-7': 0.42, // Shopmark (least busy)
};
const DEFAULT_TARGET = 0.7;
const MAX_STEP = 10; // bigger range than [-6,+6] so a single tick can move ~1%

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
  const snapshot: OccupancyUpdate[] = [];
  for (const c of centers) {
    // Pull occupancy toward the target ratio (mean-reversion); bias the random
    // delta proportionally to the distance from the target.
    const target = Math.round((TARGET_RATIO[c.id] ?? DEFAULT_TARGET) * c.capacity);
    const gap = target - c.occupied;
    const bias = Math.sign(gap) * Math.min(Math.abs(gap) * 0.15, MAX_STEP / 2);
    const noise = (Math.random() - 0.5) * MAX_STEP;
    const delta = Math.round(bias + noise);
    const next = Math.max(0, Math.min(c.capacity, c.occupied + delta));
    update.run(next, now, c.id);
    recordHistory.run(c.id, next, c.capacity, now);
    snapshot.push({
      centerId: c.id,
      occupied: next,
      capacity: c.capacity,
      ratio: c.capacity > 0 ? next / c.capacity : 0,
      recordedAt: now,
    });
  }
  if (snapshot.length > 0) {
    occupancyBus.emitSnapshot({ centers: snapshot, recordedAt: now });
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
