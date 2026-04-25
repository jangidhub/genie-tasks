import { Slot, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { initializeDatabase } from "../db";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import "../global.css";
import { View, Text } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const GEOFENCE_TASK_NAME = 'GENIE_GEOFENCE_TASK';

TaskManager.defineTask(GEOFENCE_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error("Geofence error:", error.message);
    return;
  }
  if (data) {
    const { eventType, region } = data as any;
    if (eventType === Location.GeofencingEventType.Enter) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "📍 Genie Location Alert!",
          body: `You have arrived at your task location!`,
          sound: true,
        },
        trigger: null,
      });
    }
  }
});

export default function RootLayout() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    try {
      initializeDatabase();
      setDbInitialized(true);
    } catch (e) {
      console.error("Database initialization failed", e);
    }

    const requestPermissions = async () => {
      await Notifications.requestPermissionsAsync();
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus === 'granted') {
        await Location.requestBackgroundPermissionsAsync();
      }
    };
    
    requestPermissions();
  }, []);

  if (!dbInitialized) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">Waking up Genie...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
