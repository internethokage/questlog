import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// TODO: Replace with actual API data
const REALMS = [
  { key: 'asgard', name: 'Asgard', level: 33, tier: 4, unlocked: false, current: false },
  { key: 'muspelheim', name: 'Muspelheim', level: 28, tier: 3, unlocked: false, current: false },
  { key: 'vanaheim', name: 'Vanaheim', level: 23, tier: 3, unlocked: false, current: false },
  { key: 'alfheim', name: 'Alfheim', level: 18, tier: 3, unlocked: false, current: false },
  { key: 'jotunheim', name: 'Jotunheim', level: 14, tier: 2, unlocked: true, current: true },
  { key: 'midgard', name: 'Midgard', level: 10, tier: 2, unlocked: true, current: false },
  { key: 'svartalfheim', name: 'Svartalfheim', level: 6, tier: 2, unlocked: true, current: false },
  { key: 'niflheim', name: 'Niflheim', level: 4, tier: 1, unlocked: true, current: false },
  { key: 'helheim', name: 'Helheim', level: 1, tier: 1, unlocked: true, current: false },
];

const REALM_ICONS = {
  asgard: '👑',
  muspelheim: '🔥',
  vanaheim: '🌿',
  alfheim: '☀️',
  jotunheim: '🏔️',
  midgard: '⚔️',
  svartalfheim: '⚒️',
  niflheim: '❄️',
  helheim: '💀',
};

const TIER_LABELS = {
  1: 'The Roots',
  2: 'The Trunk',
  3: 'The Canopy',
  4: 'The Crown',
};

export default function MapScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌳 Yggdrasil</Text>
        <Text style={styles.subtitle}>The World Tree</Text>
        <Text style={styles.description}>
          Climb from Helheim to Asgard. Each realm tests your resolve.
        </Text>
      </View>

      {/* Realms (Top to Bottom) */}
      {REALMS.map((realm, index) => {
        const showTierLabel = index === 0 || REALMS[index - 1].tier !== realm.tier;
        
        return (
          <View key={realm.key}>
            {showTierLabel && (
              <View style={styles.tierLabel}>
                <Text style={styles.tierText}>
                  {TIER_LABELS[realm.tier].toUpperCase()}
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={[
                styles.realmNode,
                realm.current && styles.realmNodeCurrent,
                !realm.unlocked && styles.realmNodeLocked,
              ]}
              disabled={!realm.unlocked}
            >
              <Text style={styles.realmIcon}>
                {REALM_ICONS[realm.key]}
              </Text>
              <View style={styles.realmInfo}>
                <Text style={[
                  styles.realmName,
                  !realm.unlocked && styles.realmNameLocked
                ]}>
                  {realm.name}
                </Text>
                <Text style={styles.realmLevel}>
                  Level {realm.level}+
                </Text>
              </View>
              {realm.current && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current</Text>
                </View>
              )}
            </TouchableOpacity>
            
            {/* Branch Connection */}
            {index < REALMS.length - 1 && (
              <View style={styles.branch} />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 2,
    borderBottomColor: '#2d4059',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffd700',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  tierLabel: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  tierText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 2,
  },
  realmNode: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 24,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2d4059',
  },
  realmNodeCurrent: {
    borderColor: '#ffd700',
    backgroundColor: '#2e2e1a',
  },
  realmNodeLocked: {
    opacity: 0.5,
    backgroundColor: '#1a1a2e',
  },
  realmIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  realmInfo: {
    flex: 1,
  },
  realmName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  realmNameLocked: {
    color: '#666',
  },
  realmLevel: {
    fontSize: 14,
    color: '#888',
  },
  currentBadge: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f0f1e',
  },
  branch: {
    width: 4,
    height: 16,
    backgroundColor: '#2d4059',
    marginLeft: 60,
  },
});
