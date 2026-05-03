import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { Task } from '../store/taskStore';

interface TaskProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (task.isCompleted || !task.expiresAt || !task.time) {
      progress.stopAnimation();
      return;
    }

    const now = Date.now();
    const totalDuration = task.time * 60 * 1000;
    const timeRemaining = task.expiresAt - now;

    if (timeRemaining > 0) {
      // Set the initial width based on remaining time
      progress.setValue(timeRemaining / totalDuration);
      
      // Animate smoothly to 0 over the remaining time
      Animated.timing(progress, {
        toValue: 0,
        duration: timeRemaining,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else {
      progress.setValue(0);
    }

    return () => {
      progress.stopAnimation();
    };
  }, [task.expiresAt, task.time, task.isCompleted]);

  return (
    <View className="bg-neutral-900 rounded-2xl mb-4 mx-1 shadow-sm border border-neutral-800 overflow-hidden">
      <View className="p-4 flex-row items-center">
        <TouchableOpacity 
          className="flex-row items-center flex-1" 
          onPress={onToggle}
        >
          {/* Checkbox */}
          <View className={`w-6 h-6 rounded-md mr-4 border-2 justify-center items-center ${
            task.isCompleted ? 'bg-[#55BCF6] border-[#55BCF6]' : 'border-neutral-500 bg-transparent'
          }`}>
            {task.isCompleted && (
              <View className="w-3 h-3 bg-white rounded-sm" />
            )}
          </View>
          
          {/* Title */}
          <View className="flex-col flex-1 pr-2">
            <Text 
              className={`text-lg font-medium ${
                task.isCompleted ? 'text-neutral-500 line-through' : 'text-white'
              }`}
              numberOfLines={1}
            >
              {task.name}
            </Text>
            
            <View className="flex-row flex-wrap items-center mt-1 gap-2">
              {task.category && (
                <View className="bg-neutral-800 px-2 py-0.5 rounded text-xs">
                  <Text className="text-neutral-400 text-xs">{task.category}</Text>
                </View>
              )}
              {task.latitude && (
                <Text className="text-neutral-500 text-xs">
                  📍 {task.place || 'Location Set'}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity 
          className="w-8 h-8 justify-center items-center rounded-full bg-red-500/10 ml-2"
          onPress={onDelete}
        >
          <Text className="text-red-500 font-bold text-xs">✕</Text>
        </TouchableOpacity>
      </View>

      {/* Smooth Progress Bar Line */}
      {!task.isCompleted && task.time && task.time > 0 && (
        <View className="h-1 bg-neutral-800 w-full">
          <Animated.View 
            className="h-full bg-[#55BCF6]" 
            style={{
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }}
          />
        </View>
      )}
    </View>
  );
}
