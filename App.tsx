import './global.css';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import TaskItem from "./components/task";
import AddTaskButton from "./components/addTaskButton";
import AddTaskModal from "./components/addTaskModal";
import { useTaskStore } from "./store/taskStore";
import { initializeDatabase } from "./db";

export default function App() {
  const { tasks, loadTasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    initializeDatabase();
    setIsDbInitialized(true);
    loadTasks();
  }, [loadTasks]);

  if (!isDbInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-16 pb-4 bg-black">
        <Text className="text-4xl font-bold text-white">
          Tasks
        </Text>
      </View>

      <ScrollView className="flex-1 bg-black px-4">
        {/* Tasks List */}
        {tasks.map((task) => (
          <TaskItem 
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id, !task.isCompleted)}
            onDelete={() => deleteTask(task.id)}
          />
        ))}
        {/* Add bottom padding so the floating button doesn't block the last item */}
        <View className="h-24" />
      </ScrollView>

      {/* Floating Add Task Button */}
      <View className="absolute bottom-8 right-6 z-50">
        <AddTaskButton onPress={() => setIsModalVisible(true)} />
      </View>

      <AddTaskModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={(name, time, place, lat, lng) => {
          addTask(name, time, place, lat, lng);
        }}
      />
    </View>
  );
}
