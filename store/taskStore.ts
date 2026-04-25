import { create } from 'zustand';
import { db } from '../db';
import { tasks } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as Notifications from 'expo-notifications';

export type Task = {
  id: number;
  name: string;
  time: number | null;
  expiresAt: number | null;
  place: string | null;
  notificationId: string | null;
  isCompleted: boolean;
};

interface TaskState {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (name: string, time?: number | null, place?: string | null) => Promise<void>;
  toggleTask: (id: number, isCompleted: boolean) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loadTasks: async () => {
    const allTasks = await db.select().from(tasks);
    set({ tasks: allTasks as Task[] });
  },
  addTask: async (name, time = null, place = null) => {
    let notificationId: string | null = null;
    let expiresAt: number | null = null;

    if (time && time > 0) {
      // Calculate when the timer ends
      expiresAt = Date.now() + time * 60 * 1000;
      
      // time is treated as minutes. Convert to seconds.
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Genie Timer 🧞‍♂️",
          body: `Time's up for: ${name}`,
          sound: true,
        },
        trigger: {
          seconds: time * 60,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    }

    const [newTask] = await db.insert(tasks).values({
      name,
      time,
      expiresAt,
      place,
      notificationId,
      isCompleted: false,
    }).returning();
    
    set((state) => ({ tasks: [...state.tasks, newTask as Task] }));
  },
  toggleTask: async (id, isCompleted) => {
    const task = get().tasks.find((t) => t.id === id);
    
    // Cancel notification if marked as complete
    if (task && isCompleted && task.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(task.notificationId);
      } catch (e) {
        console.warn('Could not cancel notification', e);
      }
    }
    
    await db.update(tasks)
      .set({ isCompleted })
      .where(eq(tasks.id, id));
      
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, isCompleted } : t)),
    }));
  },
  deleteTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    
    // Clean up scheduled notification if task is deleted
    if (task?.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(task.notificationId);
      } catch (e) {
        console.warn('Could not cancel notification', e);
      }
    }

    await db.delete(tasks).where(eq(tasks.id, id));
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
}));
