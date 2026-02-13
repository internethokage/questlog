import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

// TODO: Replace with actual API data
const MOCK_CHARACTER = {
  name: 'Adventurer',
  level: 14,
  current_realm: 'Jotunheim',
  strength: 45,
  intelligence: 30,
  luck: 25,
  charisma: 20,
  current_hp: 180,
  max_hp: 220,
  attack_power: 52,
  defense: 18,
  gold: 1250,
};

const STAT_COLORS = {
  strength: '#d62828',
  intelligence: '#4a7c59',
  luck: '#ffd700',
  charisma: '#f4e4c1',
};

export default function CharacterScreen() {
  const hpPercent = (MOCK_CHARACTER.current_hp / MOCK_CHARACTER.max_hp) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Character Sprite (Placeholder) */}
      <View style={styles.spriteContainer}>
        <View style={styles.sprite}>
          <Text style={styles.spriteText}>⚔️</Text>
          <Text style={styles.spriteName}>{MOCK_CHARACTER.name}</Text>
          <Text style={styles.spriteLevel}>Level {MOCK_CHARACTER.level}</Text>
          <Text style={styles.spriteRealm}>{MOCK_CHARACTER.current_realm}</Text>
        </View>
      </View>

      {/* HP Bar */}
      <View style={styles.hpContainer}>
        <View style={styles.hpHeader}>
          <Text style={styles.hpLabel}>Health</Text>
          <Text style={styles.hpValue}>
            {MOCK_CHARACTER.current_hp} / {MOCK_CHARACTER.max_hp}
          </Text>
        </View>
        <View style={styles.hpBarBg}>
          <View style={[styles.hpBarFill, { width: `${hpPercent}%` }]} />
        </View>
      </View>

      {/* Primary Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Stats</Text>
        
        <StatBar 
          label="Strength" 
          value={MOCK_CHARACTER.strength} 
          color={STAT_COLORS.strength}
          icon="🏃"
        />
        <StatBar 
          label="Intelligence" 
          value={MOCK_CHARACTER.intelligence} 
          color={STAT_COLORS.intelligence}
          icon="🧠"
        />
        <StatBar 
          label="Luck" 
          value={MOCK_CHARACTER.luck} 
          color={STAT_COLORS.luck}
          icon="💰"
        />
        <StatBar 
          label="Charisma" 
          value={MOCK_CHARACTER.charisma} 
          color={STAT_COLORS.charisma}
          icon="🤝"
        />
      </View>

      {/* Combat Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Combat Stats</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>⚔️ Attack Power</Text>
          <Text style={styles.statValue}>{MOCK_CHARACTER.attack_power}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🛡️ Defense</Text>
          <Text style={styles.statValue}>{MOCK_CHARACTER.defense}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>💰 Gold</Text>
          <Text style={[styles.statValue, { color: '#ffd700' }]}>
            {MOCK_CHARACTER.gold}
          </Text>
        </View>
      </View>

      {/* Equipped Gear (TODO) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipped Gear</Text>
        <Text style={styles.placeholder}>Gear system coming soon...</Text>
      </View>
    </ScrollView>
  );
}

function StatBar({ label, value, color, icon }) {
  const maxStat = 100; // For visualization
  const percent = Math.min((value / maxStat) * 100, 100);

  return (
    <View style={styles.statBar}>
      <View style={styles.statBarHeader}>
        <Text style={styles.statBarLabel}>
          {icon} {label}
        </Text>
        <Text style={[styles.statBarValue, { color }]}>{value}</Text>
      </View>
      <View style={styles.statBarBg}>
        <View style={[styles.statBarFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  spriteContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 2,
    borderBottomColor: '#2d4059',
  },
  sprite: {
    alignItems: 'center',
  },
  spriteText: {
    fontSize: 80,
    marginBottom: 12,
  },
  spriteName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  spriteLevel: {
    fontSize: 18,
    color: '#ffd700',
    marginBottom: 4,
  },
  spriteRealm: {
    fontSize: 16,
    color: '#888',
  },
  hpContainer: {
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  hpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  hpValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d62828',
  },
  hpBarBg: {
    height: 12,
    backgroundColor: '#2d4059',
    borderRadius: 6,
    overflow: 'hidden',
  },
  hpBarFill: {
    height: '100%',
    backgroundColor: '#d62828',
    borderRadius: 6,
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
  statBar: {
    marginBottom: 16,
  },
  statBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statBarLabel: {
    fontSize: 15,
    color: '#fff',
  },
  statBarValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  statBarBg: {
    height: 10,
    backgroundColor: '#2d4059',
    borderRadius: 5,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d4059',
  },
  statLabel: {
    fontSize: 16,
    color: '#fff',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  placeholder: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});
