import { Slot, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { initializeDatabase } from "../db";
import * as Notifications from "expo-notifications";
import "../global.css";
import { View, Text } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
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

    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn("Notification permissions not granted");
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
