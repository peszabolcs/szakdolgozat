import { Router } from 'express';
import { z } from 'zod';
import PDFDocument from 'pdfkit';
import { getDb } from '../db/client';
import { requireAuth, requireRole } from '../auth/middleware';

const router = Router();

const QuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

interface AggregateRow {
  centerId: string;
  centerName: string;
  capacity: number;
  averageOccupancy: number;
  peakOccupancy: number;
  peakAt: string | null;
  sampleCount: number;
}

router.get('/occupancy.pdf', requireAuth, requireRole('admin'), (req, res) => {
  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ code: 'invalid_query', message: 'Érvénytelen idő-paraméter.' });
  }
  const now = new Date();
  const defaultFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const from = parsed.data.from ?? defaultFrom.toISOString();
  const to = parsed.data.to ?? now.toISOString();

  const db = getDb();
  const centers = db
    .prepare('SELECT id, name, capacity FROM shopping_centers ORDER BY name ASC')
    .all() as Array<{ id: string; name: string; capacity: number }>;

  const aggregates: AggregateRow[] = centers.map((c) => {
    const rows = db
      .prepare(
        'SELECT occupied, capacity, recorded_at FROM occupancy_history WHERE center_id = ? AND recorded_at BETWEEN ? AND ?'
      )
      .all(c.id, from, to) as Array<{ occupied: number; capacity: number; recorded_at: string }>;
    if (rows.length === 0) {
      return {
        centerId: c.id,
        centerName: c.name,
        capacity: c.capacity,
        averageOccupancy: 0,
        peakOccupancy: 0,
        peakAt: null,
        sampleCount: 0,
      };
    }
    let sum = 0;
    let peak = -1;
    let peakAt: string | null = null;
    for (const r of rows) {
      sum += r.occupied;
      if (r.occupied > peak) {
        peak = r.occupied;
        peakAt = r.recorded_at;
      }
    }
    return {
      centerId: c.id,
      centerName: c.name,
      capacity: c.capacity,
      averageOccupancy: Math.round((sum / rows.length) * 100) / 100,
      peakOccupancy: peak,
      peakAt,
      sampleCount: rows.length,
    };
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="parkvision-foglaltsag.pdf"');

  const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: 'ParkVision foglaltsági riport' } });
  doc.pipe(res);

  // Header
  doc.fontSize(20).font('Helvetica-Bold').text('ParkVision', { continued: true }).font('Helvetica').fontSize(14).text('  foglaltsági riport');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('gray').text(`Időszak: ${new Date(from).toLocaleDateString('hu-HU')} – ${new Date(to).toLocaleDateString('hu-HU')}`);
  doc.text(`Generálva: ${new Date().toLocaleString('hu-HU')}`);
  doc.moveDown(1);
  doc.fillColor('black');

  // Summary
  const totalSamples = aggregates.reduce((a, r) => a + r.sampleCount, 0);
  const overallAvg = aggregates.length > 0
    ? Math.round(
        (aggregates.reduce((a, r) => a + (r.capacity > 0 ? r.averageOccupancy / r.capacity : 0), 0) / aggregates.length) * 1000
      ) / 10
    : 0;
  doc.fontSize(12).font('Helvetica-Bold').text('Összefoglaló');
  doc.font('Helvetica').fontSize(11);
  doc.text(`Bevásárlóközpontok száma: ${aggregates.length}`);
  doc.text(`Mintavételek összesen: ${totalSamples}`);
  doc.text(`Átlagos foglaltsági arány: ${overallAvg}%`);
  doc.moveDown(1);

  // Table header
  const tableTop = doc.y;
  const colX = { name: 50, capacity: 240, avg: 320, peak: 400, samples: 490 };
  doc.font('Helvetica-Bold').fontSize(10);
  doc.text('Központ', colX.name, tableTop);
  doc.text('Kapacitás', colX.capacity, tableTop);
  doc.text('Átlag', colX.avg, tableTop);
  doc.text('Csúcs', colX.peak, tableTop);
  doc.text('Minta', colX.samples, tableTop);
  doc.moveTo(50, tableTop + 14).lineTo(545, tableTop + 14).stroke();
  doc.font('Helvetica').fontSize(10);

  let y = tableTop + 20;
  for (const row of aggregates) {
    const avgPct = row.capacity > 0 ? Math.round((row.averageOccupancy / row.capacity) * 100) : 0;
    const peakPct = row.capacity > 0 ? Math.round((row.peakOccupancy / row.capacity) * 100) : 0;
    doc.text(row.centerName, colX.name, y, { width: 180 });
    doc.text(String(row.capacity), colX.capacity, y);
    doc.text(`${row.averageOccupancy} (${avgPct}%)`, colX.avg, y);
    doc.text(`${row.peakOccupancy} (${peakPct}%)`, colX.peak, y);
    doc.text(String(row.sampleCount), colX.samples, y);
    y += 18;
    if (y > 780) {
      doc.addPage();
      y = 50;
    }
  }

  doc.moveDown(2);
  doc.fontSize(9).fillColor('gray').text('A riport az IoT-szimulátor által rögzített foglaltsági adatokon alapul. Forrás: occupancy_history tábla.', { align: 'center' });

  doc.end();
});

export default router;
