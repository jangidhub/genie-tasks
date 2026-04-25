import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Task from "./componants/task";
import AddTaskButton from "./componants/addTaskButton";

export default function App() {
  const [tasks, setTasks] = useState([
    'Exercise',
    'Buy groceries',
    'Read a book',

  ]);
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  const addTask = (taskName) => {
    if (taskName.trim() !== '') {
      setTasks([...tasks, taskName]);
    }
  };

  const showAddTaskAlert = () => {
    Alert.prompt(
      'Add New Task',
      'Enter the task name:',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Add',
          onPress: (text) => addTask(text),
          style: 'default'
        }
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.containerBg }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Header with Title and Theme Toggle */}
      <View style={[styles.header, { backgroundColor: themeStyles.headerBg }]}>
        <Text style={[styles.Title, { color: themeStyles.textColor }]}>
          Tasks
        </Text>
        <TouchableOpacity 
          style={[styles.themeButton, { backgroundColor: themeStyles.buttonBg }]}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <Image
            source={isDarkMode ? require('./assets/brightness.png') : require('./assets/darkness.png')}
            style={styles.themeIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.wraper, { backgroundColor: themeStyles.wrapperBg }]}>
        {/* Tasks List */}
        {tasks.map((title, index) => (
          <Task 
            key={index}
            title={title}
            onDelete={() => deleteTask(index)}
            isDarkMode={isDarkMode}
            themeStyles={themeStyles}
          />
        ))}
      </ScrollView>

      {/* Floating Add Task Button */}
      <View style={styles.floatingButtonContainer}>
        <AddTaskButton onPress={showAddTaskAlert} themeStyles={themeStyles} />
      </View>
    </View>

  );
}

const lightTheme = {
  containerBg: '#ffffff',
  headerBg: '#ffffff',
  wrapperBg: '#ffffff',
  textColor: '#000000',
  buttonBg: '#000000',
  inputBg: '#f5f5f5',
  inputBorderColor: '#000000',
};

const darkTheme = {
  containerBg: '#000000',
  headerBg: '#000000',
  wrapperBg: '#000000',
  textColor: '#ffffff',
  buttonBg: '#ffffff',
  inputBg: '#111111',
  inputBorderColor: '#ffffff',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
  },
  wraper: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 0,
  },
  Title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333',
  },
  themeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#55BCF6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 24,
    paddingBottom: 2,
  },
  themeIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 10,
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    color: '#000000',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100,
  },
});
