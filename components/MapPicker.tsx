import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

interface MapPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (lat: number, lng: number) => void;
}

export default function MapPicker({ visible, onClose, onSelectLocation }: MapPickerProps) {
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [pin, setPin] = useState<{ latitude: number, longitude: number } | null>(null);

  useEffect(() => {
    if (visible) {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setPin({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      })();
    }
  }, [visible]);

  const handleConfirm = () => {
    if (pin) {
      onSelectLocation(pin.latitude, pin.longitude);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-[#111] h-[80%] rounded-t-3xl overflow-hidden border-t border-neutral-800">
          <View className="flex-row justify-between items-center p-6 pb-4">
            <Text className="text-white text-xl font-bold">Drop a Pin</Text>
            <TouchableOpacity onPress={onClose} className="bg-neutral-800 rounded-full w-8 h-8 items-center justify-center">
              <Text className="text-white font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 rounded-2xl mx-4 mb-4 overflow-hidden border border-neutral-700">
            <MapView
              style={{ flex: 1 }}
              region={region}
              onRegionChangeComplete={setRegion}
              onPress={(e) => setPin(e.nativeEvent.coordinate)}
              userInterfaceStyle="dark"
              showsUserLocation
            >
              {pin && (
                <Marker coordinate={pin} />
              )}
            </MapView>
          </View>

          <View className="p-6 pt-0">
            <Text className="text-neutral-400 text-sm text-center mb-4">
              {pin ? "Tap the map to move the pin." : "Tap anywhere on the map to drop a pin."}
            </Text>
            
            <TouchableOpacity
              className={`p-4 rounded-2xl items-center shadow-lg ${pin ? 'bg-[#55BCF6]' : 'bg-neutral-800'}`}
              disabled={!pin}
              onPress={handleConfirm}
            >
              <Text className={`text-lg font-bold ${pin ? 'text-black' : 'text-neutral-500'}`}>
                Set Geofence Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
