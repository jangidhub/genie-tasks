import { TouchableOpacity, Text } from 'react-native';

interface AddTaskButtonProps {
  onPress: () => void;
}

export default function AddTaskButton({ onPress }: AddTaskButtonProps) {
  return (
    <TouchableOpacity 
      className="w-16 h-16 rounded-full bg-[#55BCF6] justify-center items-center shadow-lg shadow-black/50"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className="text-white text-3xl font-light mb-1">+</Text>
    </TouchableOpacity>
  );
}
