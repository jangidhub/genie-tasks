import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

function AddTaskButton({ onPress, themeStyles }) {
  return (
    <TouchableOpacity
      style={[styles.addButton, { backgroundColor: themeStyles.buttonBg }]}
      onPress={onPress}
    >
      <Text style={[styles.addButtonText, { color: themeStyles.textColor }]}>+</Text>
    </TouchableOpacity>
  );
}

export default AddTaskButton;

const styles = StyleSheet.create({
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
