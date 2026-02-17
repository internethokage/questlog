# 🔷 QuestLog Idle RPG System - Implementation Summary

**Branch:** `feature/idle-rpg-system`  
**Status:** Ready for review  
**PR:** https://github.com/internethokage/questlog/pull/new/feature/idle-rpg-system

---

## What Changed

### The Big Idea
**Before:** Habit tracker with XP and levels  
**After:** Habit tracker meets **idle RPG** with pixel art warrior

**The Loop:**
1. Complete real-life habit (e.g., go to gym)
2. Earn XP → your pixel warrior gets stronger
3. Warrior auto-fights monsters in the background
4. Check app → collect loot (gear, gold)
5. Equip better gear → fight harder monsters → better rewards
6. Rinse, repeat, level up IRL and in-game

Inspired by **RuneBlade** (Apple Watch idle RPG).

---

## New Database Tables

### `characters`
Your pixel warrior. One per user, auto-created on signup.

**Fields:**
- `name` - Character name (default "Adventurer")
- `level` - Based on total XP earned
- `strength`, `intelligence`, `luck`, `charisma` - Stats (boosted by habit categories)
- `current_hp`, `max_hp` - Health for battles
- `attack_power`, `defense` - Combat stats
- `gold` - Currency from battles
- `in_battle`, `current_enemy_id` - Battle state

### `gear`
Inventory system. Weapons, armor, accessories.

**Fields:**
- `name` - Item name (e.g., "Iron Sword")
- `type` - weapon, armor, helmet, boots, accessory
- `rarity` - common, uncommon, rare, epic, legendary
- `stat_bonuses` - JSON object (e.g., `{"attack_power": 10, "strength": 5}`)
- `equipped` - Boolean (only one per slot)

### `monsters`
Global templates for enemies. Pre-seeded with 6 monsters.

**Starter Monsters:**
1. Slime (Level 1) - Easy starter
2. Goblin (Level 2) - Common enemy
3. Wolf (Level 3) - Mid-tier
4. Orc Warrior (Level 5) - Tough fight
5. Dark Knight (Level 8) - Challenge
6. Dragon (Level 15) - Epic boss

**Fields:**
- `name`, `level`, `hp`, `attack_power`, `defense`
- `xp_reward`, `gold_min`, `gold_max`
- `loot_table` - JSON array of possible drops with chances
- `sprite_key` - Reference to pixel art asset

### `battle_log`
Combat history.

**Fields:**
- `monster_name`, `monster_level`
- `victory` (boolean)
- `damage_dealt`, `damage_taken`
- `xp_gained`, `gold_gained`
- `loot_dropped` - JSON array of gear items acquired

---

## New API Routes

### `/api/character`
- `GET /api/character` - Fetch character + equipped gear
- `PATCH /api/character/name` - Rename your warrior
- `GET /api/character/gear` - View full inventory
- `POST /api/character/gear/:id/equip` - Equip/unequip items

### `/api/battles`
- `GET /api/battles/log` - View battle history (last 20 by default)
- `POST /api/battles/start` - Start a new battle (manual for MVP)
- `POST /api/battles/resolve` - Auto-resolve battle (turn-based simulation)
- `GET /api/battles/monsters` - List all available monsters

---

## How Habits → Character Works

**Category to Stat Mapping:**
- 🏃 Health habits → **Strength** (melee damage)
- 🧠 Mind habits → **Intelligence** (magic, future feature)
- 💰 Wealth habits → **Luck** (loot drop chance, gold bonus)
- 🤝 Social habits → **Charisma** (NPC interactions, future)

**Formula:**
```javascript
stat_value = (category_level × 5) + gear_bonuses
```

**Example:**
- User completes "Gym session" (Health, difficulty 4)
- Earns 40 XP → Health category levels up to 8
- Character Strength = (8 × 5) + gear_bonuses = 40 + bonuses
- Character can now fight tougher monsters!

---

## Battle System

### Auto-Combat Simulation
```javascript
// Turn-based, auto-resolved
while (character.hp > 0 && monster.hp > 0) {
  // Character attacks
  damage = max(1, attack_power - monster.defense)
  monster.hp -= damage
  
  // Monster attacks (if still alive)
  damage = max(1, monster.attack_power - character.defense)
  character.hp -= damage
}

// Victory = XP + gold + loot roll
// Defeat = HP loss, no rewards
```

### Loot Drops
Each monster has a `loot_table`:
```json
[
  {
    "name": "Iron Sword",
    "type": "weapon",
    "rarity": "uncommon",
    "stat_bonuses": {"attack_power": 8, "strength": 3},
    "chance": 0.25
  }
]
```

On victory, roll for each item. If roll succeeds, add to inventory.

### Idle Progression (Future)
- Background service runs every 5 mins
- Auto-starts battles for active users
- Resolves instantly
- Sends push notification: "Your warrior defeated an Orc! +60 XP, +35 gold, found Iron Sword!"

---

## Gear System

### 5 Slots
1. **Weapon** - Primary attack boost
2. **Armor** - Defense + HP
3. **Helmet** - Intelligence + defense
4. **Boots** - Speed (future) + minor stats
5. **Accessory** - Luck, charisma, specials

### 5 Rarity Tiers
| Rarity | Color | Drop Chance | Stat Range |
|---|---|---|---|
| Common | Gray | 50% | +1-5 |
| Uncommon | Green | 30% | +5-10 |
| Rare | Blue | 15% | +10-20 |
| Epic | Purple | 4% | +20-40 |
| Legendary | Gold | 1% | +40-100 |

### Equip Flow
- Tap gear in inventory → equip
- Only one item per slot
- Equipping auto-unequips current item in that slot
- Character stats recalculate instantly

---

## Visual Style (Pixel Art)

**Aesthetic:**
- 16x16 or 32x32 sprites
- Retro JRPG feel (Final Fantasy, Dragon Quest vibes)
- Dark mode optimized (deep blues, purples)
- Bright rarity colors (gray → green → blue → purple → gold)

**Assets Needed (MVP):**
- Character sprite (idle, attack, victory animations)
- 6 monster sprites (Slime, Goblin, Wolf, Orc, Dark Knight, Dragon)
- Gear icons (weapons, armor, helmets, boots, accessories)
- UI elements (HP/XP bars, buttons, borders)

**Tools:**
- Aseprite (pixel art editor, $20)
- Piskel (free browser-based alternative)
- itch.io / OpenGameArt for free sprite packs (placeholder for MVP)

---

## MVP Scope (Still 2 Weeks)

### Week 1: Core + Battles
- [x] RPG database schema
- [x] Character + battles API
- [ ] Mobile app screens:
  - Login
  - Habits list + check-in
  - **Character screen** (stats, sprite, HP/XP bars)
  - **Battle log** (scrollable text list)
- [ ] Pixel art sprites (character + 6 monsters)
- [ ] Habit completion → character stat sync (working)

### Week 2: Loot + Idle Loop
- [ ] Inventory UI (grid view, rarity filters)
- [ ] Equip/unequip flow
- [ ] Loot drop animations (simple fade-in + rarity color flash)
- [ ] Background battle service (5-min cron or Expo Task Manager)
- [ ] Push notifications ("Your warrior found a Rare sword!")
- [ ] Daily quests (AI picks 3 habits, frames as RPG quests)
- [ ] Social sharing (export "my warrior" card with stats)

---

## Stretch Goals (Post-MVP)

### Wearables
1. 🍎 **Apple Watch** - Quick habit check-in, battle status glance, HP/XP complications
2. 🤖 **WearOS** - Same features as Apple Watch
3. 🥽 **Rokid AR Glasses** - AR warrior in your FOV, voice commands ("Hex, start a battle"), real-time battle overlays

### Advanced Features
- **Guilds** - Team up with friends, shared boss fights
- **PvP** - Challenge friends, ranked leaderboards
- **Skill trees** - Unlock special abilities (e.g., "Double Strike" at Strength 50+)
- **Seasonal events** - Halloween monsters, Christmas loot, limited-time gear

---

## What's Next

1. **Tre reviews this PR** (schema + API + architecture)
2. **Set up Supabase project**
   - Run migration `001_initial_schema.sql`
   - Run migration `002_idle_rpg_system.sql`
3. **Test API endpoints** (Postman or curl)
4. **Start building mobile UI** (character screen first)
5. **Find/create pixel art sprites** (can start with free placeholders)
6. **Wire up habit completion → battle flow**

---

## Files Changed

```
A  ARCHITECTURE.md                              # Full technical blueprint
M  README.md                                     # Updated with idle RPG vision
M  server/src/index.js                          # Added character + battles routes
A  server/src/routes/battles.js                 # Battle system API (708 lines)
A  server/src/routes/character.js               # Character management API (550 lines)
M  server/src/routes/habits.js                  # Added character stat sync
A  server/supabase/migrations/002_idle_rpg_system.sql  # RPG tables + seed data
M  shared/types/index.d.ts                      # TypeScript types for RPG system
```

---

**This is the vision. RuneBlade meets habit tracking. Pixel art warrior powered by your real-life discipline. Let's ship it. 🔷**
