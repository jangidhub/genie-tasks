import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  time: integer('time'), // Total duration in minutes
  expiresAt: integer('expiresAt'), // Absolute timestamp (ms) when timer ends
  place: text('place'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  radius: integer('radius'), // Geofence radius in meters
  notificationId: text('notificationId'),
  category: text('category'), // Category like Personal, Work, etc.
  isCompleted: integer('isCompleted', { mode: 'boolean' }).default(false).notNull(),
});
