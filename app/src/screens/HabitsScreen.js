import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

// TODO: Replace with actual API calls
const MOCK_HABITS = [
  { id: '1', name: 'Morning Workout', category: 'health', difficulty: 4, completed: false },
  { id: '2', name: 'Read for 30 minutes', category: 'mind', difficulty: 2, completed: false },
  { id: '3', name: 'Work on side project', category: 'wealth', difficulty: 3, completed: true },
  { id: '4', name: 'Call a friend', category: 'social', difficulty: 2, completed: false },
];

const CATEGORY_COLORS = {
  health: '#d62828',  // Red (Strength)
  mind: '#4a7c59',    // Blue-green (Intelligence)
  wealth: '#ffd700',  // Gold (Luck)
  social: '#f4e4c1',  // Silver (Charisma)
};

const CATEGORY_EMOJI = {
  health: '🏃',
  mind: '🧠',
  wealth: '💰',
  social: '🤝',
};

export default function HabitsScreen() {
  const [habits, setHabits] = useState(MOCK_HABITS);
  const [totalXP, setTotalXP] = useState(0);

  const completedCount = habits.filter(h => h.completed).length;
  const progressPercent = (completedCount / habits.length) * 100;

  const handleCompleteHabit = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit.completed) {
      Alert.alert('Already completed!', 'You\'ve already completed this quest today.');
      return;
    }

    const xpEarned = habit.difficulty * 10;
    
    // Update habit
    setHabits(habits.map(h => 
      h.id === habitId ? { ...h, completed: true } : h
    ));

    // Award XP
    setTotalXP(totalXP + xpEarned);

    // Show XP notification
    Alert.alert(
      '⚔️ Quest Complete!',
      `+${xpEarned} XP earned!\nYour warrior grows stronger!`,
      [{ text: 'Nice!', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <Text style={styles.progressCount}>{completedCount}/{habits.length}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Habit List */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.habitCard,
              item.completed && styles.habitCardCompleted,
            ]}
            onPress={() => handleCompleteHabit(item.id)}
            disabled={item.completed}
          >
            <View style={styles.habitLeft}>
              <View style={[
                styles.categoryDot,
                { backgroundColor: CATEGORY_COLORS[item.category] }
              ]} />
              <View style={styles.habitInfo}>
                <Text style={[
                  styles.habitName,
                  item.completed && styles.habitNameCompleted
                ]}>
                  {item.name}
                </Text>
                <Text style={styles.habitMeta}>
                  {CATEGORY_EMOJI[item.category]} {item.difficulty * 10} XP
                </Text>
              </View>
            </View>
            <View style={styles.habitRight}>
              {item.completed ? (
                <Text style={styles.checkmark}>✅</Text>
              ) : (
                <View style={styles.checkbox} />
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Habit Button (TODO) */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 2,
    borderBottomColor: '#2d4059',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#2d4059',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffd700',
    borderRadius: 6,
  },
  listContent: {
    padding: 16,
  },
  habitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2d4059',
  },
  habitCardCompleted: {
    opacity: 0.6,
    borderColor: '#4a7c59',
    backgroundColor: '#1a2e1a',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  habitNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  habitMeta: {
    fontSize: 14,
    color: '#888',
  },
  habitRight: {
    marginLeft: 12,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  checkmark: {
    fontSize: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffd700',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#0f0f1e',
    fontWeight: 'bold',
  },
});
