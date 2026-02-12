import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const CATEGORIES = [
  { key: 'health', label: 'Health', icon: '🏃', color: '#d62828' },
  { key: 'mind', label: 'Mind', icon: '🧠', color: '#4a7c59' },
  { key: 'wealth', label: 'Wealth', icon: '💰', color: '#ffd700' },
  { key: 'social', label: 'Social', icon: '🤝', color: '#f4e4c1' },
];

const FREQUENCIES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'custom', label: 'Custom' },
];

const DIFFICULTIES = [
  { value: 1, label: 'Very Easy', xp: 10 },
  { value: 2, label: 'Easy', xp: 20 },
  { value: 3, label: 'Medium', xp: 30 },
  { value: 4, label: 'Hard', xp: 40 },
  { value: 5, label: 'Very Hard', xp: 50 },
];

export default function AddHabitModal({ visible, onClose, onSave, editingHabit = null }) {
  const [name, setName] = useState(editingHabit?.name || '');
  const [category, setCategory] = useState(editingHabit?.category || 'health');
  const [difficulty, setDifficulty] = useState(editingHabit?.difficulty || 3);
  const [frequency, setFrequency] = useState(editingHabit?.frequency || 'daily');

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a habit name');
      return;
    }

    onSave({
      id: editingHabit?.id,
      name: name.trim(),
      category,
      difficulty,
      frequency,
    });

    // Reset form
    setName('');
    setCategory('health');
    setDifficulty(3);
    setFrequency('daily');
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setName('');
    setCategory('health');
    setDifficulty(3);
    setFrequency('daily');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {editingHabit ? 'Edit Habit' : 'New Habit'}
              </Text>
            </View>

            {/* Name Input */}
            <View style={styles.section}>
              <Text style={styles.label}>Habit Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Morning Workout"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>

            {/* Category Selector */}
            <View style={styles.section}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryCard,
                      category === cat.key && styles.categoryCardActive,
                      category === cat.key && { borderColor: cat.color },
                    ]}
                    onPress={() => setCategory(cat.key)}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Difficulty Selector */}
            <View style={styles.section}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.difficultyList}>
                {DIFFICULTIES.map(diff => (
                  <TouchableOpacity
                    key={diff.value}
                    style={[
                      styles.difficultyCard,
                      difficulty === diff.value && styles.difficultyCardActive,
                    ]}
                    onPress={() => setDifficulty(diff.value)}
                  >
                    <Text style={[
                      styles.difficultyLabel,
                      difficulty === diff.value && styles.difficultyLabelActive
                    ]}>
                      {diff.label}
                    </Text>
                    <Text style={styles.difficultyXP}>{diff.xp} XP</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Frequency Selector */}
            <View style={styles.section}>
              <Text style={styles.label}>Frequency</Text>
              <View style={styles.frequencyRow}>
                {FREQUENCIES.map(freq => (
                  <TouchableOpacity
                    key={freq.key}
                    style={[
                      styles.frequencyCard,
                      frequency === freq.key && styles.frequencyCardActive,
                    ]}
                    onPress={() => setFrequency(freq.key)}
                  >
                    <Text style={[
                      styles.frequencyLabel,
                      frequency === freq.key && styles.frequencyLabelActive
                    ]}>
                      {freq.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={handleSave}
              >
                <Text style={styles.buttonTextSave}>
                  {editingHabit ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#2d4059',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 24,
    paddingTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#0f0f1e',
    borderWidth: 2,
    borderColor: '#2d4059',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  categoryCard: {
    width: '48%',
    margin: '1%',
    backgroundColor: '#0f0f1e',
    borderWidth: 2,
    borderColor: '#2d4059',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  categoryCardActive: {
    backgroundColor: '#2e2e1a',
    borderWidth: 3,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  difficultyList: {
    gap: 8,
  },
  difficultyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
    borderWidth: 2,
    borderColor: '#2d4059',
    borderRadius: 12,
    padding: 16,
  },
  difficultyCardActive: {
    backgroundColor: '#2e2e1a',
    borderColor: '#ffd700',
    borderWidth: 3,
  },
  difficultyLabel: {
    fontSize: 16,
    color: '#fff',
  },
  difficultyLabelActive: {
    fontWeight: 'bold',
  },
  difficultyXP: {
    fontSize: 14,
    color: '#888',
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyCard: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    borderWidth: 2,
    borderColor: '#2d4059',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  frequencyCardActive: {
    backgroundColor: '#2e2e1a',
    borderColor: '#ffd700',
    borderWidth: 3,
  },
  frequencyLabel: {
    fontSize: 14,
    color: '#fff',
  },
  frequencyLabelActive: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#2d4059',
  },
  buttonSave: {
    backgroundColor: '#ffd700',
  },
  buttonTextCancel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonTextSave: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f0f1e',
  },
});
