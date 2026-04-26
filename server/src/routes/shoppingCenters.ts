import { Router } from 'express';
import { getDb } from '../db/client';

const router = Router();

interface CenterRow {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
  occupied: number;
  opening_hours: string;
  description: string;
  image_url: string | null;
  updated_at: string;
}

function rowToCenter(row: CenterRow) {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    location: { lat: row.lat, lng: row.lng },
    capacity: row.capacity,
    occupied: row.occupied,
    openingHours: row.opening_hours,
    description: row.description,
    imageUrl: row.image_url ?? undefined,
    updatedAt: row.updated_at,
  };
}

router.get('/', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM shopping_centers ORDER BY name').all() as CenterRow[];
  res.json(rows.map(rowToCenter));
});

router.get('/:id', (req, res) => {
  const row = getDb()
    .prepare('SELECT * FROM shopping_centers WHERE id = ?')
    .get(req.params.id) as CenterRow | undefined;
  if (!row) return res.status(404).json({ message: 'Shopping center not found' });
  res.json(rowToCenter(row));
});

router.get('/:id/history', (req, res) => {
  const rows = getDb()
    .prepare(
      'SELECT recorded_at as recordedAt, occupied, capacity FROM occupancy_history WHERE center_id = ? ORDER BY recorded_at ASC'
    )
    .all(req.params.id) as Array<{ recordedAt: string; occupied: number; capacity: number }>;
  if (rows.length === 0) return res.status(404).json({ message: 'No history available' });
  res.json(rows);
});

export default router;
