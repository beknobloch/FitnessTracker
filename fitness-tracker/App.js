import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NavigatorStack from './navigators/NavigatorStack';
import React from 'react';

export default function App() {
  return (
    <View style={styles.container}>
      <NavigatorStack />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
