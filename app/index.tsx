import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState, useMemo } from "react";
import { useTaskStore } from "../store/taskStore";
import TaskItem from "../components/task";
import AddTaskButton from "../components/addTaskButton";
import AddTaskModal from "../components/addTaskModal";

export default function Home() {
  const { tasks, loadTasks, addTask, deleteTask, toggleTask } = useTaskStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<string>('All');

  const CATEGORIES = ['All', 'Personal', 'Work', 'Shopping', 'Health', 'Errands'];

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = (name: string, time: number | null, place: string | null, lat: number | null, lng: number | null, category: string | null) => {
    addTask(name, time, place, lat, lng, 100, category); // 100 meter radius
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'All') return tasks;
    return tasks.filter(t => t.category === filter);
  }, [tasks, filter]);

  return (
    <View className="flex-1 bg-[#0a0a0a] pt-14 pb-5 px-5 relative">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-4xl font-bold text-white tracking-tight">Genie Tasks</Text>
      </View>

      <View className="mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat}
              onPress={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full mr-2 border ${
                filter === cat ? 'bg-[#55BCF6] border-[#55BCF6]' : 'bg-transparent border-neutral-700'
              }`}
            >
              <Text className={`font-medium ${filter === cat ? 'text-black' : 'text-neutral-400'}`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-neutral-500 text-lg">No tasks found.</Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
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
