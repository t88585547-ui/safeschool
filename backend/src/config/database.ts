import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { env } from './env';

const dbDir = path.dirname(env.DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Instantiate native Node.js SQLite database
const rawDb = new DatabaseSync(env.DB_PATH);

// Enable WAL mode and pragmas
rawDb.exec('PRAGMA journal_mode = WAL;');
rawDb.exec('PRAGMA foreign_keys = ON;');
rawDb.exec('PRAGMA busy_timeout = 5000;');

export interface DBInterface {
  prepare: (sql: string) => {
    run: (...params: any[]) => { changes: number | bigint; lastInsertRowid: number | bigint };
    get: (...params: any[]) => any;
    all: (...params: any[]) => any[];
  };
  exec: (sql: string) => void;
  pragma: (sql: string) => void;
  transaction: <T extends (...args: any[]) => any>(fn: T) => T;
}

const db: DBInterface = {
  prepare: (sql: string) => {
    const stmt = rawDb.prepare(sql);
    return {
      run: (...params: any[]) => stmt.run(...params),
      get: (...params: any[]) => stmt.get(...params),
      all: (...params: any[]) => stmt.all(...params),
    };
  },
  exec: (sql: string) => rawDb.exec(sql),
  pragma: (sql: string) => rawDb.exec(`PRAGMA ${sql};`),
  transaction: <T extends (...args: any[]) => any>(fn: T): T => {
    return ((...args: any[]) => {
      rawDb.exec('BEGIN');
      try {
        const result = fn(...args);
        rawDb.exec('COMMIT');
        return result;
      } catch (error) {
        rawDb.exec('ROLLBACK');
        throw error;
      }
    }) as T;
  },
};

export function initializeSchema(): void {
  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  rawDb.exec(schema);
}

export default db;
