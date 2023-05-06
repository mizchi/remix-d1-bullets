/*
  DO NOT RENAME THIS FILE FOR DRIZZLE-ORM TO WORK
*/
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { InferModel } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey().notNull(),
  googleProfileId: text('googleProfileId').notNull(),
  serviceId: text('serviceId'),
  iconUrl: text('iconUrl'),
  displayName: text('name').notNull(),
  registeredAt: integer('registeredAt', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  googleProfileIdIdx: uniqueIndex('googleProfileIdIdx').on(table.googleProfileId),
  serviceIdIdx: uniqueIndex('serviceIdIdx').on(table.serviceId),
}));

export type User = InferModel<typeof users>;

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey().notNull(),
  ownerId: integer('ownerId').references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export type Post = InferModel<typeof posts>;
