import { Router } from 'express';
import { getDb } from '../db/client';

const router = Router();

router.get('/stats', (_req, res) => {
  const db = getDb();
  const totals = db
    .prepare(
      'SELECT COUNT(*) as totalCenters, COALESCE(SUM(capacity),0) as totalCapacity, COALESCE(SUM(occupied),0) as totalOccupied FROM shopping_centers'
    )
    .get() as { totalCenters: number; totalCapacity: number; totalOccupied: number };

  const totalFree = totals.totalCapacity - totals.totalOccupied;
  const averageOccupancy = totals.totalCapacity > 0 ? Math.round((totals.totalOccupied / totals.totalCapacity) * 100) : 0;

  const reservationsToday = db
    .prepare(
      "SELECT COUNT(*) as c FROM reservations WHERE date(slot_start) = date('now') AND status = 'active'"
    )
    .get() as { c: number };

  res.json({
    totalCenters: totals.totalCenters,
    totalCapacity: totals.totalCapacity,
    totalOccupied: totals.totalOccupied,
    totalFree,
    averageOccupancy,
    activeReservationsToday: reservationsToday.c,
    generatedAt: new Date().toISOString(),
  });
});

export default router;
