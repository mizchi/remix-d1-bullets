import { drizzle } from 'drizzle-orm/d1';

export function createClient(db: D1Database) {
  return drizzle(db);
}