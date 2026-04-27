import { registerRootComponent } from 'expo';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import App from './App';

const GEOFENCE_TASK_NAME = 'GENIE_GEOFENCE_TASK';

TaskManager.defineTask(GEOFENCE_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { eventType, region } = data as any;
    if (eventType === 1) { // 1 = Location.GeofencingEventType.Enter
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Genie Location Alert 📍",
          body: `You've arrived at your task location!`,
          sound: true,
        },
        trigger: null, // trigger immediately
      });
    }
  }
});

// Notifications handler configuration for immediate notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

registerRootComponent(App);
