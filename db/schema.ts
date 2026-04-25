import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  time: integer('time'), // Total duration in minutes
  expiresAt: integer('expiresAt'), // Absolute timestamp (ms) when timer ends
  place: text('place'),
  notificationId: text('notificationId'),
  isCompleted: integer('isCompleted', { mode: 'boolean' }).default(false).notNull(),
});
