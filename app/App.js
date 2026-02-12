import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔷 QuestLog</Text>
      <Text style={styles.subtitle}>Turn your habits into XP</Text>
      <Text style={styles.version}>v0.1.0 - MVP Scaffolding Complete</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#888',
    marginBottom: 32,
  },
  version: {
    fontSize: 14,
    color: '#444',
    marginTop: 16,
  },
});
