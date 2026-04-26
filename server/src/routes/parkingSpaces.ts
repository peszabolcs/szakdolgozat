import { Router } from 'express';
import { getDb } from '../db/client';

const router = Router();

interface SpaceRow {
  id: string;
  center_id: string;
  label: string;
  status: 'occupied' | 'free';
  updated_at: string;
  center_name: string;
}

router.get('/', (_req, res) => {
  const rows = getDb()
    .prepare(
      `SELECT ps.id, ps.center_id, ps.label, ps.status, ps.updated_at, sc.name as center_name
       FROM parking_spaces ps
       JOIN shopping_centers sc ON sc.id = ps.center_id
       ORDER BY sc.name, ps.label`
    )
    .all() as SpaceRow[];
  res.json(
    rows.map((r) => ({
      id: r.id,
      areaId: r.center_id,
      areaName: r.center_name,
      label: r.label,
      status: r.status,
      updatedAt: r.updated_at,
    }))
  );
});

export default router;
