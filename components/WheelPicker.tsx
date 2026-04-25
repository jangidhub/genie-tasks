import { View, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRef } from 'react';

interface WheelPickerProps {
  items: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  itemHeight?: number;
}

export default function WheelPicker({ items, selectedValue, onValueChange, itemHeight = 46 }: WheelPickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  
  const spacerCount = 2; // number of empty items to pad

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    let index = Math.round(offsetY / itemHeight);
    
    // Safety bounds
    if (index < 0) index = 0;
    if (index >= items.length) index = items.length - 1;
    
    if (items[index] !== selectedValue) {
      onValueChange(items[index]);
    }
  };

  return (
    <View style={{ height: itemHeight * (spacerCount * 2 + 1) }} className="relative w-20 items-center overflow-hidden">
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{
          paddingVertical: itemHeight * spacerCount,
        }}
      >
        {items.map((item, index) => {
          const isSelected = item === selectedValue;
          return (
            <View 
              key={index} 
              style={{ height: itemHeight, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text 
                className={`text-center ${isSelected ? 'text-white font-bold text-3xl' : 'text-neutral-600 font-medium text-2xl'}`}
              >
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Selection Highlight */}
      <View 
        style={{ height: itemHeight, top: itemHeight * spacerCount }}
        className="absolute w-full border-t border-b border-neutral-700/80 pointer-events-none" 
      />
      
      {/* Top and Bottom Fade covers */}
      <View style={{ height: itemHeight * spacerCount }} className="absolute top-0 w-full bg-[#111]/70 pointer-events-none" />
      <View style={{ height: itemHeight * spacerCount }} className="absolute bottom-0 w-full bg-[#111]/70 pointer-events-none" />
    </View>
  );
}
