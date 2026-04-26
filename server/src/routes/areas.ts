import { Router } from 'express';
import { getDb } from '../db/client';

const router = Router();

interface AreaRow {
  id: string;
  name: string;
  description: string;
  capacity: number;
  occupied: number;
  status: 'active' | 'inactive';
  lat: number | null;
  lng: number | null;
  address: string | null;
}

router.get('/', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM areas ORDER BY name').all() as AreaRow[];
  res.json(
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      capacity: r.capacity,
      occupied: r.occupied,
      status: r.status,
      ...(r.lat !== null && r.lng !== null
        ? { location: { lat: r.lat, lng: r.lng, address: r.address ?? '' } }
        : {}),
    }))
  );
});

export default router;
