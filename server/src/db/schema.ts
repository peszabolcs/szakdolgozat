import type { Database } from 'better-sqlite3';

export function applySchema(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'visitor')),
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shopping_centers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      capacity INTEGER NOT NULL,
      occupied INTEGER NOT NULL DEFAULT 0,
      opening_hours TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image_url TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS parking_spaces (
      id TEXT PRIMARY KEY,
      center_id TEXT NOT NULL,
      label TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('occupied', 'free')),
      updated_at TEXT NOT NULL,
      FOREIGN KEY (center_id) REFERENCES shopping_centers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS areas (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      capacity INTEGER NOT NULL,
      occupied INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
      lat REAL,
      lng REAL,
      address TEXT
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      center_id TEXT NOT NULL,
      center_name TEXT NOT NULL,
      slot_start TEXT NOT NULL,
      slot_end TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'cancelled')),
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (center_id) REFERENCES shopping_centers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS occupancy_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id TEXT NOT NULL,
      occupied INTEGER NOT NULL,
      capacity INTEGER NOT NULL,
      recorded_at TEXT NOT NULL,
      FOREIGN KEY (center_id) REFERENCES shopping_centers(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id);
    CREATE INDEX IF NOT EXISTS idx_reservations_center ON reservations(center_id);
    CREATE INDEX IF NOT EXISTS idx_occupancy_center_time ON occupancy_history(center_id, recorded_at);
  `);
}
