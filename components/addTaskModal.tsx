import { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, timeInMinutes: number | null) => void;
}

const TIME_OPTIONS = [
  { label: 'None', value: null },
  { label: '1 min', value: 1 },
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '1 hr', value: 60 },
];

export default function AddTaskModal({ visible, onClose, onAdd }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState('');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const handleAdd = () => {
    if (taskName.trim()) {
      onAdd(taskName.trim(), selectedTime);
      setTaskName('');
      setSelectedTime(null);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end bg-black/60"
      >
        <View className="bg-[#111] rounded-t-3xl p-6 pb-10 border-t border-neutral-800 shadow-2xl">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-2xl font-bold">New Task</Text>
            <TouchableOpacity onPress={onClose} className="bg-neutral-800 rounded-full w-8 h-8 items-center justify-center">
              <Text className="text-white font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            className="bg-[#1a1a1a] text-white p-4 rounded-xl text-lg border border-neutral-700 mb-6"
            placeholder="What do you need to do?"
            placeholderTextColor="#666"
            value={taskName}
            onChangeText={setTaskName}
            autoFocus
          />

          <Text className="text-neutral-400 font-semibold mb-3 ml-1 uppercase tracking-wider text-xs">
            Set a Timer (Optional)
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {TIME_OPTIONS.map((option) => {
              const isSelected = selectedTime === option.value;
              return (
                <TouchableOpacity
                  key={option.label}
                  onPress={() => setSelectedTime(option.value)}
                  className={`px-4 py-2 rounded-full border ${
                    isSelected 
                      ? 'bg-[#55BCF6] border-[#55BCF6]' 
                      : 'bg-transparent border-neutral-600'
                  }`}
                >
                  <Text className={`font-medium ${isSelected ? 'text-black' : 'text-neutral-300'}`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            className={`p-4 rounded-2xl items-center shadow-lg ${
              taskName.trim() ? 'bg-white' : 'bg-neutral-800'
            }`}
            disabled={!taskName.trim()}
            onPress={handleAdd}
            activeOpacity={0.8}
          >
            <Text className={`text-lg font-bold ${taskName.trim() ? 'text-black' : 'text-neutral-500'}`}>
              Add Task
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
