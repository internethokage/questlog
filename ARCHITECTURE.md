# QuestLog Architecture

## Vision

**Habit tracker meets idle RPG with pixel art aesthetic.**

Real-life habits fuel a pixel warrior that fights monsters in the background. Check in to collect loot, equip gear, and watch your character grow stronger as you level up IRL.

---

## Data Flow

```
User completes habit
    ↓
Earns XP (difficulty × 10)
    ↓
XP updates user_stats (category XP + levels)
    ↓
Character stats updated (Health → Strength, Mind → Intelligence, etc.)
    ↓
Character auto-battles monsters (every 5 mins in background)
    ↓
Battle resolves: Victory → XP, gold, loot | Defeat → HP loss
    ↓
User checks app → sees battle log, new gear, level-ups
    ↓
Equips better gear → character stronger → can fight harder monsters
    ↓
Harder monsters = better rewards = more motivation to keep habits
```

---

## Database Schema

### User & Habits (Core)
```sql
profiles        -- User metadata (username, avatar, timezone)
habits          -- Habit definitions (name, category, difficulty)
habit_logs      -- Completion history (timestamp, XP earned)
user_stats      -- XP and levels per category (health, mind, wealth, social)
```

### RPG System
```sql
characters      -- User's warrior (stats, HP, gold, battle state)
gear            -- Inventory (weapons, armor, stat bonuses)
monsters        -- Global templates (level, stats, loot tables)
battle_log      -- Combat history (victories, defeats, rewards)
```

---

## Category → Stat Mapping

| Habit Category | Character Stat | Effect |
|---|---|---|
| Health 🏃 | Strength | Melee damage |
| Mind 🧠 | Intelligence | Magic damage (future) |
| Wealth 💰 | Luck | Loot drop chance + gold bonus |
| Social 🤝 | Charisma | NPC interactions (future) |

**Formula:** `stat_value = (category_level × 5) + gear_bonuses`

---

## Combat System

### Battle Flow
1. User/system triggers battle start
2. Character matched with suitable monster (level ± 2)
3. Turn-based auto-combat simulation:
   - Character attacks: `damage = max(1, attack_power - monster.defense)`
   - Monster attacks: `damage = max(1, monster.attack_power - character.defense)`
   - Repeat until one side reaches 0 HP
4. Battle resolves:
   - Victory: Award XP, gold, roll for loot drops
   - Defeat: Character loses HP, no rewards
5. Log battle to `battle_log` table
6. Update character state (HP, gold, loot inventory)

### Idle Progression
- Background service runs every 5 minutes
- Checks for users with active characters (not in battle)
- Auto-starts new battles based on character level
- Resolves battles instantly (no manual input needed)
- Sends push notification on victory with loot summary

---

## Loot System

### Gear Slots
- **Weapon** - Primary attack power boost
- **Armor** - Defense + HP bonuses
- **Helmet** - Intelligence + defense
- **Boots** - Speed (future) + minor stats
- **Accessory** - Luck, charisma, special effects

### Rarity Tiers
| Rarity | Color | Drop Chance | Stat Bonus Range |
|---|---|---|---|
| Common | Gray | 50% | +1-5 |
| Uncommon | Green | 30% | +5-10 |
| Rare | Blue | 15% | +10-20 |
| Epic | Purple | 4% | +20-40 |
| Legendary | Gold | 1% | +40-100 |

### Loot Drops
- Each monster has a `loot_table` (JSON array)
- Each item has a `chance` value (0.0 - 1.0)
- On victory, roll for each item in loot table
- If roll succeeds, add item to user's gear inventory
- User can equip/unequip from inventory screen

---

## XP & Leveling

### Habit Completion XP
```javascript
baseXP = habit.difficulty * 10
// Example: difficulty 3 habit = 30 XP
```

### Category Leveling (User Stats)
```javascript
xpForNextLevel = currentLevel ** 2 * 100
// Level 1 → 2: 100 XP
// Level 5 → 6: 2,500 XP
// Level 10 → 11: 10,000 XP
```

### Character Leveling (Total XP)
```javascript
characterLevel = floor(sqrt(totalXP / 100)) + 1
// 100 XP → Level 2
// 900 XP → Level 4
// 10,000 XP → Level 11
```

---

## API Architecture

### Habits API
- `POST /api/habits/:id/complete`
  1. Create habit_log entry
  2. Award XP to user_stats (category + total)
  3. Calculate new category level
  4. Update character stat based on category
  5. Return XP earned + new level

### Character API
- `GET /api/character` - Fetch character + equipped gear
- `PATCH /api/character/name` - Rename warrior
- `POST /api/character/gear/:id/equip` - Equip/unequip item
  - Unequips any existing item in same slot
  - Recalculates character stats with new gear bonuses

### Battles API
- `POST /api/battles/start` - Initiate manual battle
  - Finds suitable monster (character level ± 2)
  - Sets `in_battle = true`, stores `current_enemy_id`
- `POST /api/battles/resolve` - Auto-resolve battle
  - Simulates turn-based combat
  - Awards XP, gold, loot on victory
  - Logs battle to `battle_log`
- `GET /api/battles/log` - View battle history

---

## Background Services (Future)

### Idle Battle Loop
```javascript
// Every 5 minutes
for (user in activeUsers) {
  if (!user.character.in_battle && user.character.current_hp > 0) {
    // Start new battle
    monster = findSuitableMonster(user.character.level)
    startBattle(user, monster)
    
    // Auto-resolve
    result = simulateBattle(user.character, monster)
    
    // Award rewards
    updateCharacter(user, result)
    logBattle(user, result)
    
    // Notify user
    sendPushNotification(user, result)
  }
}
```

### Healing System (Future)
- Characters regenerate HP over time (1% per 10 mins)
- Or use gold to buy instant healing (10 gold = full HP)
- Prevents endless battles when HP is low

---

## UI/UX Flow

### Main Screens
1. **Login** - Supabase auth (email or OAuth)
2. **Dashboard** - Today's habits + daily quests
3. **Character** - Stats, HP/XP bars, equipped gear (pixel art sprite)
4. **Battles** - Current battle status + battle log (scrollable history)
5. **Inventory** - All gear, equip/unequip, rarity filters
6. **Stats** - Category levels, progress bars, XP history charts

### Habit Check-In Flow
```
Tap habit → Mark complete → XP animation → Level up notification (if triggered)
                                  ↓
                        "Your warrior gained +5 Strength!"
```

### Battle Flow (Idle)
```
Background service triggers battle
    ↓
Push notification: "Your warrior is fighting an Orc!"
    ↓
User opens app → sees battle log
    ↓
"Victory! Defeated Orc Warrior. +60 XP, +35 gold, found Iron Sword!"
    ↓
Tap to equip new gear → character sprite updates with new weapon
```

---

## Tech Stack

### Frontend
- **React Native** (Expo) - iOS + Android
- **NativeWind** - Tailwind CSS for React Native
- **React Navigation** - Screen routing
- **Expo Notifications** - Push alerts for battles
- **Aseprite / Piskel** - Pixel art assets

### Backend
- **Node.js + Express** - REST API
- **Supabase** - Postgres + Auth + RLS + Realtime
- **Redis** (local) - Leaderboards, battle queue cache

### Services
- **Background Tasks** (future) - Expo TaskManager or cloud functions
- **Push Notifications** - Expo Push Notification Service

---

## Monetization

**Free Tier**
- 3 habits max
- Basic character (no cosmetics)
- Limited battles per day (10)
- Basic AI insights (1/week)

**Pro Tier ($7/mo)**
- Unlimited habits
- Premium character skins (pixel art variants)
- Unlimited battles
- Full AI coach (daily insights)
- Exclusive loot (legendary drops 2x chance)
- Social features (guilds, PvP)

---

## Stretch Goals

### Wearables
1. **Apple Watch** - Quick habit check-in, battle status, HP/XP glance
2. **WearOS** - Same as Apple Watch
3. **Rokid AR Glasses** 🥽 - AR warrior in your FOV, voice commands, real-time battle overlays

### Advanced Features
- **Guilds** - Team battles, shared loot pools
- **PvP** - Challenge friends, ranked leaderboards
- **Skill trees** - Unlock special abilities (e.g., "Double Strike" for Strength 50+)
- **Seasonal events** - Halloween monsters, Christmas loot, limited-time gear
- **NFT integration** (controversial but lucrative) - Legendary gear as NFTs

---

**This is the blueprint. Let's build it. 🔷**
