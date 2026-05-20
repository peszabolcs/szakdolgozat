import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/client';

const router = Router();

const QuerySchema = z.object({
  hoursAhead: z.coerce.number().int().min(1).max(168).default(24),
  lookbackDays: z.coerce.number().int().min(1).max(60).default(14),
});

interface HistoryRow {
  occupied: number;
  capacity: number;
  recorded_at: string;
}

interface ForecastPoint {
  hour: string;
  predictedOccupancy: number;
  predictedRatio: number;
  capacity: number;
  confidence: 'low' | 'medium' | 'high';
  sampleCount: number;
  minSeen: number;
  maxSeen: number;
}

function bucketKey(date: Date): string {
  return `${date.getUTCDay()}-${date.getUTCHours()}`;
}

router.get('/:centerId', (req, res) => {
  const { centerId } = req.params;
  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ code: 'invalid_query', message: 'Érvénytelen lekérdezési paraméter.' });
  }
  const { hoursAhead, lookbackDays } = parsed.data;

  const db = getDb();
  const center = db
    .prepare('SELECT id, name, capacity, occupied FROM shopping_centers WHERE id = ?')
    .get(centerId) as { id: string; name: string; capacity: number; occupied: number } | undefined;
  if (!center) {
    return res.status(404).json({ code: 'not_found', message: 'A bevásárlóközpont nem található.' });
  }

  const since = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000).toISOString();
  const rows = db
    .prepare(
      'SELECT occupied, capacity, recorded_at FROM occupancy_history WHERE center_id = ? AND recorded_at >= ? ORDER BY recorded_at ASC'
    )
    .all(centerId, since) as HistoryRow[];

  // Group historical samples by (day-of-week, hour-of-day) bucket.
  const buckets = new Map<string, number[]>();
  for (const row of rows) {
    const ts = new Date(row.recorded_at);
    const key = bucketKey(ts);
    const ratio = row.capacity > 0 ? row.occupied / row.capacity : 0;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(ratio);
  }

  // Generate forecast points for the next `hoursAhead` hours, anchored to the next full hour.
  const points: ForecastPoint[] = [];
  const start = new Date();
  start.setUTCMinutes(0, 0, 0);
  start.setUTCHours(start.getUTCHours() + 1);

  const fallbackRatio = center.capacity > 0 ? center.occupied / center.capacity : 0;

  for (let i = 0; i < hoursAhead; i++) {
    const ts = new Date(start.getTime() + i * 60 * 60 * 1000);
    const key = bucketKey(ts);
    const samples = buckets.get(key) ?? [];
    let predicted: number;
    let confidence: 'low' | 'medium' | 'high';
    let minSeen = 0;
    let maxSeen = 0;
    if (samples.length === 0) {
      // No history → assume current occupancy with high uncertainty.
      predicted = fallbackRatio;
      confidence = 'low';
    } else {
      const mean = samples.reduce((acc, x) => acc + x, 0) / samples.length;
      predicted = mean;
      minSeen = Math.min(...samples);
      maxSeen = Math.max(...samples);
      // Confidence rises with sample count and tightness of the band.
      const spread = maxSeen - minSeen;
      if (samples.length >= 8 && spread < 0.25) confidence = 'high';
      else if (samples.length >= 4 && spread < 0.4) confidence = 'medium';
      else confidence = 'low';
    }
    const clamped = Math.max(0, Math.min(1, predicted));
    points.push({
      hour: ts.toISOString(),
      predictedOccupancy: Math.round(clamped * center.capacity),
      predictedRatio: Math.round(clamped * 1000) / 1000,
      capacity: center.capacity,
      confidence,
      sampleCount: samples.length,
      minSeen: Math.round(minSeen * 1000) / 1000,
      maxSeen: Math.round(maxSeen * 1000) / 1000,
    });
  }

  // Highlight the best window in the next 24 hours (lowest predicted occupancy).
  const next24 = points.slice(0, Math.min(24, points.length));
  const bestSlot = next24.reduce(
    (best, p) => (p.predictedRatio < best.predictedRatio ? p : best),
    next24[0] ?? null
  );

  return res.json({
    centerId: center.id,
    centerName: center.name,
    capacity: center.capacity,
    currentOccupancy: center.occupied,
    lookbackDays,
    hoursAhead,
    sampleSize: rows.length,
    bestSlot: bestSlot
      ? {
          hour: bestSlot.hour,
          predictedOccupancy: bestSlot.predictedOccupancy,
          predictedRatio: bestSlot.predictedRatio,
          confidence: bestSlot.confidence,
        }
      : null,
    points,
    generatedAt: new Date().toISOString(),
  });
});

export default router;
