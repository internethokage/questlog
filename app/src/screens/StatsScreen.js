import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// TODO: Replace with actual API data
const MOCK_STATS = {
  total_xp: 5250,
  health_xp: 1500,
  mind_xp: 1200,
  wealth_xp: 1400,
  social_xp: 1150,
  health_level: 8,
  mind_level: 7,
  wealth_level: 7,
  social_level: 7,
};

const CATEGORIES = [
  { 
    key: 'health', 
    label: 'Health', 
    icon: '🏃', 
    color: '#d62828',
    stat: 'Strength',
  },
  { 
    key: 'mind', 
    label: 'Mind', 
    icon: '🧠', 
    color: '#4a7c59',
    stat: 'Intelligence',
  },
  { 
    key: 'wealth', 
    label: 'Wealth', 
    icon: '💰', 
    color: '#ffd700',
    stat: 'Luck',
  },
  { 
    key: 'social', 
    label: 'Social', 
    icon: '🤝', 
    color: '#f4e4c1',
    stat: 'Charisma',
  },
];

export default function StatsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Total XP */}
      <View style={styles.totalXP}>
        <Text style={styles.totalXPLabel}>Total XP Earned</Text>
        <Text style={styles.totalXPValue}>{MOCK_STATS.total_xp.toLocaleString()}</Text>
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Progress</Text>
        
        {CATEGORIES.map(cat => {
          const xp = MOCK_STATS[`${cat.key}_xp`];
          const level = MOCK_STATS[`${cat.key}_level`];
          const xpForCurrentLevel = (level - 1) ** 2 * 100;
          const xpForNextLevel = level ** 2 * 100;
          const xpIntoLevel = xp - xpForCurrentLevel;
          const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
          const progressPercent = (xpIntoLevel / xpNeededForLevel) * 100;

          return (
            <View key={cat.key} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <View>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                    <Text style={styles.categoryStat}>
                      {cat.stat} • Level {level}
                    </Text>
                  </View>
                </View>
                <Text style={styles.categoryXP}>{xp} XP</Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[
                    styles.progressBarFill,
                    { width: `${progressPercent}%`, backgroundColor: cat.color }
                  ]} />
                </View>
                <Text style={styles.progressText}>
                  {Math.floor(xpIntoLevel)} / {xpNeededForLevel} XP to Level {level + 1}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progression</Text>
        
        <TouchableOpacity style={styles.linkCard}>
          <Text style={styles.linkIcon}>🌳</Text>
          <View style={styles.linkInfo}>
            <Text style={styles.linkTitle}>Skill Trees</Text>
            <Text style={styles.linkDesc}>Unlock abilities with skill points</Text>
          </View>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkCard}>
          <Text style={styles.linkIcon}>📜</Text>
          <View style={styles.linkInfo}>
            <Text style={styles.linkTitle}>Lore Codex</Text>
            <Text style={styles.linkDesc}>Collected knowledge fragments</Text>
          </View>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkCard}>
          <Text style={styles.linkIcon}>🏆</Text>
          <View style={styles.linkInfo}>
            <Text style={styles.linkTitle}>Achievements</Text>
            <Text style={styles.linkDesc}>Milestones and trophies</Text>
          </View>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  totalXP: {
    padding: 24,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2d4059',
  },
  totalXPLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalXPValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  section: {
    padding: 20,
    marginTop: 8,
    backgroundColor: '#1a1a2e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  categoryCard: {
    padding: 16,
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2d4059',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  categoryStat: {
    fontSize: 14,
    color: '#888',
  },
  categoryXP: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#2d4059',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2d4059',
  },
  linkIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  linkDesc: {
    fontSize: 14,
    color: '#888',
  },
  linkArrow: {
    fontSize: 32,
    color: '#666',
  },
});
