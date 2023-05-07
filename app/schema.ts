/*
  DO NOT RENAME THIS FILE FOR DRIZZLE-ORM TO WORK
*/
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey().notNull(),
  googleProfileId: text('googleProfileId').notNull(),
  iconUrl: text('iconUrl'),
  displayName: text('displayName').notNull(),
  registeredAt: integer('registeredAt', { mode: 'timestamp' }).notNull(),
});
