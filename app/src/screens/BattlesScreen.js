import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// TODO: Replace with actual API data
const MOCK_BATTLES = [
  {
    id: '1',
    monster_name: 'Frost Giant',
    monster_level: 14,
    victory: true,
    xp_gained: 60,
    gold_gained: 35,
    loot_dropped: ['Iron Sword'],
    completed_at: '2 hours ago',
  },
  {
    id: '2',
    monster_name: 'Stone Behemoth',
    monster_level: 15,
    victory: true,
    xp_gained: 70,
    gold_gained: 42,
    loot_dropped: ['Giant-Bone Club'],
    completed_at: '5 hours ago',
  },
  {
    id: '3',
    monster_name: 'Giant Wolf',
    monster_level: 13,
    victory: false,
    damage_taken: 85,
    completed_at: '8 hours ago',
  },
];

export default function BattlesScreen() {
  return (
    <View style={styles.container}>
      {/* Current Battle Status (TODO) */}
      <View style={styles.currentBattle}>
        <Text style={styles.currentBattleTitle}>⚔️ No Active Battle</Text>
        <Text style={styles.currentBattleText}>
          Complete habits to fuel your warrior's next fight!
        </Text>
      </View>

      {/* Battle Log */}
      <View style={styles.logHeader}>
        <Text style={styles.logTitle}>Battle History</Text>
      </View>
      
      <FlatList
        data={MOCK_BATTLES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.battleCard,
            !item.victory && styles.battleCardDefeat
          ]}>
            <View style={styles.battleHeader}>
              <Text style={styles.monsterName}>
                {item.victory ? '⚔️' : '💀'} {item.monster_name}
              </Text>
              <Text style={styles.monsterLevel}>Lv {item.monster_level}</Text>
            </View>
            
            {item.victory ? (
              <View style={styles.battleRewards}>
                <Text style={styles.rewardText}>
                  +{item.xp_gained} XP  •  +{item.gold_gained} 💰
                </Text>
                {item.loot_dropped.length > 0 && (
                  <Text style={styles.lootText}>
                    🎁 {item.loot_dropped.join(', ')}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={styles.defeatText}>
                Defeated • -{item.damage_taken} HP
              </Text>
            )}
            
            <Text style={styles.battleTime}>{item.completed_at}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  currentBattle: {
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 2,
    borderBottomColor: '#2d4059',
    alignItems: 'center',
  },
  currentBattleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  currentBattleText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  logHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  battleCard: {
    backgroundColor: '#1a2e1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4a7c59',
  },
  battleCardDefeat: {
    backgroundColor: '#2e1a1a',
    borderColor: '#7c4a4a',
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monsterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  monsterLevel: {
    fontSize: 14,
    color: '#ffd700',
  },
  battleRewards: {
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 14,
    color: '#4a7c59',
    marginBottom: 4,
  },
  lootText: {
    fontSize: 14,
    color: '#ffd700',
  },
  defeatText: {
    fontSize: 14,
    color: '#d62828',
    marginBottom: 8,
  },
  battleTime: {
    fontSize: 12,
    color: '#666',
  },
});
