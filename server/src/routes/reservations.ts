import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { getDb } from '../db/client';
import { requireAuth } from '../auth/middleware';

const router = Router();

const CreateSchema = z.object({
  centerId: z.string().min(1),
  slotStart: z.string().datetime(),
  slotEnd: z.string().datetime(),
});

interface ReservationRow {
  id: string;
  user_id: string;
  center_id: string;
  center_name: string;
  slot_start: string;
  slot_end: string;
  status: 'active' | 'cancelled';
  created_at: string;
}

function rowToReservation(row: ReservationRow) {
  return {
    id: row.id,
    centerId: row.center_id,
    centerName: row.center_name,
    slotStart: row.slot_start,
    slotEnd: row.slot_end,
    status: row.status,
    createdAt: row.created_at,
  };
}

router.use(requireAuth);

router.get('/', (req, res) => {
  const rows = getDb()
    .prepare('SELECT * FROM reservations WHERE user_id = ? ORDER BY slot_start DESC')
    .all(req.user!.sub) as ReservationRow[];
  res.json(rows.map(rowToReservation));
});

router.post('/', (req, res) => {
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid reservation payload', issues: parsed.error.issues });
  }
  const { centerId, slotStart, slotEnd } = parsed.data;
  const start = new Date(slotStart).getTime();
  if (start <= Date.now()) {
    return res.status(422).json({ code: 'past', message: 'A választott időslot a múltban van.' });
  }

  const db = getDb();
  const center = db.prepare('SELECT id, name, capacity, occupied FROM shopping_centers WHERE id = ?').get(centerId) as
    | { id: string; name: string; capacity: number; occupied: number }
    | undefined;
  if (!center) return res.status(404).json({ message: 'Shopping center not found' });

  if (center.occupied >= center.capacity) {
    return res.status(409).json({ code: 'full', message: 'A központ jelenleg telített, nem fogadhat új foglalást.' });
  }

  const duplicate = db
    .prepare(
      'SELECT id FROM reservations WHERE user_id = ? AND center_id = ? AND slot_start = ? AND status = ?'
    )
    .get(req.user!.sub, centerId, slotStart, 'active');
  if (duplicate) {
    return res.status(409).json({ code: 'duplicate', message: 'Erre az időslotra már van foglalásod ebben a központban.' });
  }

  const reservation: ReservationRow = {
    id: randomUUID(),
    user_id: req.user!.sub,
    center_id: center.id,
    center_name: center.name,
    slot_start: slotStart,
    slot_end: slotEnd,
    status: 'active',
    created_at: new Date().toISOString(),
  };
  db.prepare(
    `INSERT INTO reservations (id, user_id, center_id, center_name, slot_start, slot_end, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    reservation.id,
    reservation.user_id,
    reservation.center_id,
    reservation.center_name,
    reservation.slot_start,
    reservation.slot_end,
    reservation.status,
    reservation.created_at
  );

  return res.status(201).json(rowToReservation(reservation));
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM reservations WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.sub) as
    | ReservationRow
    | undefined;
  if (!existing) return res.status(404).json({ message: 'Reservation not found' });
  db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run('cancelled', req.params.id);
  return res.json({ ...rowToReservation(existing), status: 'cancelled' });
});

export default router;
