import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

const expoDb = SQLite.openDatabaseSync('todogenie.db');
export const db = drizzle(expoDb);

export const initializeDatabase = () => {
  // Simple initialization logic for Phase 1. 
  // In production, you'd use Drizzle migrations (drizzle-kit).
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      time INTEGER,
      place TEXT,
      notificationId TEXT,
      isCompleted INTEGER DEFAULT 0 NOT NULL
    );
  `);

  try {
    expoDb.execSync(`ALTER TABLE tasks ADD COLUMN notificationId TEXT;`);
  } catch (e) {}

  try {
    expoDb.execSync(`ALTER TABLE tasks ADD COLUMN expiresAt INTEGER;`);
  } catch (e) {}
};
