import { View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import TaskItem from "../components/task";
import AddTaskButton from "../components/addTaskButton";
import AddTaskModal from "../components/addTaskModal";

export default function Home() {
  const { tasks, loadTasks, addTask, deleteTask, toggleTask } = useTaskStore();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = (name: string, time: number | null, place: string | null, lat: number | null, lng: number | null) => {
    addTask(name, time, place, lat, lng, 100); // 100 meter radius
  };

  return (
    <View className="flex-1 bg-[#0a0a0a] pt-14 pb-5 px-5 relative">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-4xl font-bold text-white tracking-tight">Genie Tasks</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-neutral-500 text-lg">No tasks yet. Ask Genie!</Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={() => toggleTask(task.id, !task.isCompleted)}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        )}
      </ScrollView>

      <View className="absolute bottom-10 right-6">
        <AddTaskButton onPress={() => setModalVisible(true)} />
      </View>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTask}
      />
    </View>
  );
}
