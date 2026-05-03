import { create } from 'zustand';
import { db } from '../db';
import { tasks } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export type Task = {
  id: number;
  name: string;
  time: number | null;
  expiresAt: number | null;
  place: string | null;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
  notificationId: string | null;
  category: string | null;
  isCompleted: boolean;
};

interface TaskState {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (name: string, time?: number | null, place?: string | null, lat?: number | null, lng?: number | null, radius?: number | null, category?: string | null) => Promise<void>;
  toggleTask: (id: number, isCompleted: boolean) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

const syncGeofences = async (tasksList: Task[]) => {
  const activeRegions = tasksList
    .filter(t => !t.isCompleted && t.latitude && t.longitude && t.radius)
    .map(t => ({
      identifier: `task_${t.id}`,
      latitude: t.latitude as number,
      longitude: t.longitude as number,
      radius: t.radius as number,
      notifyOnEnter: true,
      notifyOnExit: false,
    }));
  
  try {
    if (activeRegions.length > 0) {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status === 'granted') {
        await Location.startGeofencingAsync('GENIE_GEOFENCE_TASK', activeRegions);
      } else {
        console.warn("Background location permission denied");
      }
    } else {
      const hasTask = await TaskManager.isTaskRegisteredAsync('GENIE_GEOFENCE_TASK');
      if (hasTask) {
        await Location.stopGeofencingAsync('GENIE_GEOFENCE_TASK');
      }
    }
  } catch (e) {
    console.warn("Geofencing sync failed", e);
  }
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loadTasks: async () => {
    const allTasks = await db.select().from(tasks);
    set({ tasks: allTasks as Task[] });
    syncGeofences(allTasks as Task[]);
  },
  addTask: async (name, time = null, place = null, lat = null, lng = null, radius = 100, category = null) => {
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
      latitude: lat,
      longitude: lng,
      radius: lat ? radius : null,
      notificationId,
      category,
      isCompleted: false,
    }).returning();
    
    const newTasks = [...get().tasks, newTask as Task];
    set({ tasks: newTasks });
    syncGeofences(newTasks);
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
      
    const updatedTasks = get().tasks.map((t) => (t.id === id ? { ...t, isCompleted } : t));
    set({ tasks: updatedTasks });
    syncGeofences(updatedTasks);
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
    const updatedTasks = get().tasks.filter((t) => t.id !== id);
    set({ tasks: updatedTasks });
    syncGeofences(updatedTasks);
  },
}));
