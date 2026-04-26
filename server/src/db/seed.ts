import type { Database } from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

const SHOPPING_CENTERS = [
  { id: 'sc-1', name: 'Westend City Center', address: 'Budapest, Váci út 1-3, 1062', lat: 47.5102, lng: 19.057, capacity: 800, occupied: 645, openingHours: '10:00 - 22:00', description: 'One of the largest shopping centers in Central Europe', imageUrl: '/images/westend.jpg' },
  { id: 'sc-2', name: 'Aréna Mall', address: 'Budapest, Örs vezér tere 25/A, 1106', lat: 47.513, lng: 19.1375, capacity: 1200, occupied: 890, openingHours: '08:00 - 21:00', description: 'Modern shopping mall with extensive parking facilities', imageUrl: '/images/arena.jpg' },
  { id: 'sc-3', name: 'Allee', address: 'Budapest, Október 23. utca 8-10, 1117', lat: 47.4756, lng: 19.0483, capacity: 600, occupied: 425, openingHours: '09:00 - 21:00', description: 'Popular shopping destination in Buda side', imageUrl: '/images/allee.jpg' },
  { id: 'sc-4', name: 'MOM Park', address: 'Budapest, Alkotás utca 53, 1123', lat: 47.4927, lng: 19.0213, capacity: 950, occupied: 780, openingHours: '10:00 - 21:00', description: 'Family-friendly shopping center with modern amenities', imageUrl: '/images/mompark.jpg' },
  { id: 'sc-5', name: 'Mammut', address: 'Budapest, Lövőház utca 2-6, 1024', lat: 47.5089, lng: 19.0266, capacity: 700, occupied: 520, openingHours: '10:00 - 21:00', description: 'Two-building shopping complex in the heart of Buda', imageUrl: '/images/mammut.jpg' },
  { id: 'sc-6', name: 'Duna Plaza', address: 'Budapest, Váci út 178, 1138', lat: 47.539, lng: 19.051, capacity: 850, occupied: 650, openingHours: '09:00 - 21:00', description: 'Conveniently located shopping center in northern Budapest', imageUrl: '/images/dunaplaza.jpg' },
  { id: 'sc-7', name: 'Shopmark', address: 'Budapest, Üllői út 201, 1191', lat: 47.45, lng: 19.135, capacity: 500, occupied: 220, openingHours: '08:00 - 21:00', description: 'Compact shopping center with easy parking access', imageUrl: '/images/shopmark.jpg' },
];

const AREAS = [
  { id: 'area-a', name: 'Zone A', description: 'Premium parking — kiemelt zóna a bejárat közelében', capacity: 120, occupied: 95, status: 'active' as const, lat: 47.5102, lng: 19.057, address: 'Westend, Váci út 1' },
  { id: 'area-b', name: 'Zone B', description: 'Standard parking — földszinti, nagy kapacitás', capacity: 200, occupied: 142, status: 'active' as const, lat: 47.513, lng: 19.1375, address: 'Aréna Mall' },
  { id: 'area-c', name: 'Zone C', description: 'Family parking — szélesebb helyek', capacity: 80, occupied: 55, status: 'active' as const, lat: 47.4756, lng: 19.0483, address: 'Allee' },
  { id: 'area-d', name: 'Zone D', description: 'EV charging — elektromos töltőkkel', capacity: 40, occupied: 28, status: 'active' as const, lat: 47.4927, lng: 19.0213, address: 'MOM Park' },
  { id: 'area-e', name: 'Zone E', description: 'Visitor short-stay — max 2 órás', capacity: 60, occupied: 12, status: 'inactive' as const, lat: 47.5089, lng: 19.0266, address: 'Mammut' },
];

function generateParkingSpaces(): Array<{ id: string; centerId: string; label: string; status: 'occupied' | 'free' }> {
  const spaces: Array<{ id: string; centerId: string; label: string; status: 'occupied' | 'free' }> = [];
  for (const center of SHOPPING_CENTERS) {
    const total = Math.min(20, Math.floor(center.capacity / 50));
    for (let i = 0; i < total; i++) {
      spaces.push({
        id: `${center.id}-p${String(i + 1).padStart(3, '0')}`,
        centerId: center.id,
        label: `${center.name.charAt(0).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
        status: i < Math.floor((center.occupied / center.capacity) * total) ? 'occupied' : 'free',
      });
    }
  }
  return spaces;
}

export function seedDatabase(db: Database): void {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
  if (userCount.c > 0) {
    return;
  }

  const now = new Date().toISOString();

  const insertUser = db.prepare(
    `INSERT INTO users (id, email, name, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  );
  const adminHash = bcrypt.hashSync('admin123', 10);
  const visitorHash = bcrypt.hashSync('visitor123', 10);
  insertUser.run(randomUUID(), 'admin@parkvision.hu', 'Admin User', 'admin', adminHash, now);
  insertUser.run(randomUUID(), 'visitor@parkvision.hu', 'Demo Visitor', 'visitor', visitorHash, now);

  const insertCenter = db.prepare(
    `INSERT INTO shopping_centers (id, name, address, lat, lng, capacity, occupied, opening_hours, description, image_url, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const c of SHOPPING_CENTERS) {
    insertCenter.run(c.id, c.name, c.address, c.lat, c.lng, c.capacity, c.occupied, c.openingHours, c.description, c.imageUrl, now);
  }

  const insertSpace = db.prepare(
    `INSERT INTO parking_spaces (id, center_id, label, status, updated_at) VALUES (?, ?, ?, ?, ?)`
  );
  for (const s of generateParkingSpaces()) {
    insertSpace.run(s.id, s.centerId, s.label, s.status, now);
  }

  const insertArea = db.prepare(
    `INSERT INTO areas (id, name, description, capacity, occupied, status, lat, lng, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const a of AREAS) {
    insertArea.run(a.id, a.name, a.description, a.capacity, a.occupied, a.status, a.lat, a.lng, a.address);
  }

  const insertHistory = db.prepare(
    `INSERT INTO occupancy_history (center_id, occupied, capacity, recorded_at) VALUES (?, ?, ?, ?)`
  );
  for (const c of SHOPPING_CENTERS) {
    for (let day = 7; day >= 0; day--) {
      for (let hour = 8; hour <= 21; hour++) {
        const peak = hour >= 17 && hour <= 20 ? 0.85 : hour >= 11 && hour <= 14 ? 0.7 : 0.45;
        const noise = (Math.random() - 0.5) * 0.2;
        const ratio = Math.min(0.98, Math.max(0.05, peak + noise));
        const occupied = Math.round(c.capacity * ratio);
        const ts = new Date(Date.now() - day * 86400000);
        ts.setHours(hour, 0, 0, 0);
        insertHistory.run(c.id, occupied, c.capacity, ts.toISOString());
      }
    }
  }
}
