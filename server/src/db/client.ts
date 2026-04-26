import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { applySchema } from './schema';
import { seedDatabase } from './seed';

const DB_FILE = process.env.DB_FILE || path.resolve(process.cwd(), 'server/data/parkvision.db');
const IN_MEMORY = process.env.DB_MODE === 'memory' || process.env.VERCEL === '1';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  if (IN_MEMORY) {
    db = new Database(':memory:');
  } else {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_FILE);
  }

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  applySchema(db);
  seedDatabase(db);
  return db;
}

export function resetDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
