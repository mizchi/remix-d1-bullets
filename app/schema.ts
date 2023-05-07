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
  displayName: text('displayName').notNull(),
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

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey().notNull(),
  name: text('name').notNull(),
});

export const tagOwnerships = sqliteTable('tagOwnerships', {
  id: integer('id').primaryKey().notNull(),
  tagId: integer('tagId').references(() => tags.id),
  postId: integer('postId').references(() => posts.id),
}, (table) => ({
  tagIdPostIdIdx: uniqueIndex('tagIdPostIdIdx').on(table.tagId, table.postId),
  postIdIdx: uniqueIndex('postIdIdx').on(table.postId),
  tagIdIdx: uniqueIndex('tagIdIdx').on(table.tagId),
}));


export type Post = InferModel<typeof posts>;
