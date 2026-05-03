import { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { parseTaskWithGenie } from '../utils/genieAI';
import * as Location from 'expo-location';
import MapPicker from './MapPicker';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, timeInMinutes: number | null, place: string | null, lat: number | null, lng: number | null, category: string | null) => void;
}

const CATEGORIES = ['Personal', 'Work', 'Shopping', 'Health', 'Errands'];

const TIME_OPTIONS = [
  { label: 'None', value: null },
  { label: '1 min', value: 1 },
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '1 hr', value: 60 },
  { label: 'Custom', value: 'custom' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString());
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString());

export default function AddTaskModal({ visible, onClose, onAdd }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  
  const [selectedHours, setSelectedHours] = useState('0');
  const [selectedMinutes, setSelectedMinutes] = useState('0');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Location State
  const [showMap, setShowMap] = useState(false);
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(null);
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);

  const handleGenieMagic = async () => {
    if (!taskName.trim()) return;
    
    setIsAnalyzing(true);
    const parsed = await parseTaskWithGenie(taskName);

    if (parsed) {
      setTaskName(parsed.name);
      
      if (parsed.timeInMinutes && parsed.timeInMinutes > 0) {
        setSelectedOption('custom');
        const h = Math.floor(parsed.timeInMinutes / 60);
        const m = parsed.timeInMinutes % 60;
        setSelectedHours(h.toString());
        setSelectedMinutes(m.toString());
      } else {
        setSelectedOption(null);
      }

      if (parsed.place) {
        setSelectedPlaceName(parsed.place);
        try {
          const geocoded = await Location.geocodeAsync(parsed.place);
          if (geocoded && geocoded.length > 0) {
            setSelectedLat(geocoded[0].latitude);
            setSelectedLng(geocoded[0].longitude);
          }
        } catch(e) {
          console.warn("Geocoding failed", e);
        }
      }
    }
    
    setIsAnalyzing(false);
  };

  const handleAdd = () => {
    if (taskName.trim()) {
      let totalMinutes: number | null = null;
      
      if (selectedOption === 'custom') {
        totalMinutes = parseInt(selectedHours) * 60 + parseInt(selectedMinutes);
        if (totalMinutes === 0) totalMinutes = null;
      } else if (typeof selectedOption === 'number') {
        totalMinutes = selectedOption;
      }
      
      onAdd(taskName.trim(), totalMinutes, selectedPlaceName, selectedLat, selectedLng, selectedCategory);
      
      // Reset State
      setTaskName('');
      setSelectedOption(null);
      setSelectedHours('0');
      setSelectedMinutes('0');
      setSelectedPlaceName(null);
      setSelectedLat(null);
      setSelectedLng(null);
      setSelectedCategory(null);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
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

          <View className="relative mb-6">
            <TextInput
              className="bg-[#1a1a1a] text-white p-4 pr-16 rounded-xl text-lg border border-neutral-700"
              placeholder="e.g., Take out trash in 10 mins at home"
              placeholderTextColor="#666"
              value={taskName}
              onChangeText={setTaskName}
              autoFocus
            />
            {/* Ask Genie Button inside the TextInput */}
            {taskName.trim().length > 0 && (
              <TouchableOpacity 
                className="absolute right-3 top-3 bg-[#55BCF6]/20 p-2 rounded-lg flex-row items-center"
                onPress={handleGenieMagic}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator size="small" color="#55BCF6" />
                ) : (
                  <Text className="text-[#55BCF6] font-bold text-sm">✨ Genie</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Location Picker Button */}
          <View className="flex-row justify-between items-center mb-4 ml-1">
            <Text className="text-neutral-400 font-semibold uppercase tracking-wider text-xs">
              Geofence Trigger
            </Text>
            <TouchableOpacity onPress={() => setShowMap(true)}>
              <Text className="text-[#55BCF6] font-bold text-sm">
                {selectedLat ? '📍 Location Set' : '📍 Drop a Pin'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Map Modal */}
          <MapPicker 
            visible={showMap} 
            onClose={() => setShowMap(false)} 
            onSelectLocation={(lat, lng) => {
              setSelectedLat(lat);
              setSelectedLng(lng);
              if (!selectedPlaceName) setSelectedPlaceName("Custom Pin");
            }} 
          />

          <Text className="text-neutral-400 font-semibold mb-3 ml-1 uppercase tracking-wider text-xs">
            Set Timer Duration
          </Text>
          
          {/* Quick Pill Buttons */}
          <View className="flex-row flex-wrap gap-2 mb-6">
            {TIME_OPTIONS.map((option) => {
              const isSelected = selectedOption === option.value;
              return (
                <TouchableOpacity
                  key={option.label}
                  onPress={() => setSelectedOption(option.value)}
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

          {/* Custom Apple Native Picker */}
          {selectedOption === 'custom' && (
            <View className="flex-row items-center justify-center bg-[#1a1a1a] rounded-2xl mb-6 overflow-hidden border border-neutral-800 h-40">
              <Picker
                selectedValue={selectedHours}
                onValueChange={(val) => setSelectedHours(val)}
                style={{ flex: 1 }}
                itemStyle={{ color: 'white' }}
              >
                {HOURS.map(h => <Picker.Item key={h} label={`${h} hours`} value={h} />)}
              </Picker>
              <Picker
                selectedValue={selectedMinutes}
                onValueChange={(val) => setSelectedMinutes(val)}
                style={{ flex: 1 }}
                itemStyle={{ color: 'white' }}
              >
                {MINUTES.map(m => <Picker.Item key={m} label={`${m} min`} value={m} />)}
              </Picker>
            </View>
          )}

          <Text className="text-neutral-400 font-semibold mb-3 ml-1 uppercase tracking-wider text-xs mt-2">
            Category (Optional)
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(isSelected ? null : cat)}
                  className={`px-4 py-2 rounded-full border ${
                    isSelected 
                      ? 'bg-[#55BCF6] border-[#55BCF6]' 
                      : 'bg-transparent border-neutral-600'
                  }`}
                >
                  <Text className={`font-medium ${isSelected ? 'text-black' : 'text-neutral-300'}`}>
                    {cat}
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
