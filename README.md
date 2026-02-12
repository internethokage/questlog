# 🔷 QuestLog

**Turn your habits into XP. Level up your pixel warrior.**

A habit tracker meets idle RPG. Complete real-life habits to fuel your pixel warrior's progression. Your character fights monsters in the background, earning loot and gold while you focus on leveling up IRL.

---

## 🏗️ Project Structure

```
questlog/
├── app/              # React Native (Expo) mobile app
├── server/           # Node.js API (Express + Supabase)
├── shared/           # Shared TypeScript types
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier)
- Expo CLI (for mobile app)

### 1. Clone & Install

```bash
git clone https://github.com/internethokage/questlog.git
cd questlog
npm install
npm run install:all
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:
   - Copy contents of `server/supabase/migrations/001_initial_schema.sql`
   - Paste and execute in SQL Editor
3. Get your credentials:
   - Go to **Settings → API**
   - Copy `Project URL` and `anon public` key

### 3. Configure Server

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Server

```bash
npm run server
# Server runs on http://localhost:3000
```

### 5. Run the App

```bash
npm run app
# Expo dev server starts - scan QR with Expo Go app
```

---

## 📊 Database Schema

### Core Tables
- **profiles** - User profiles (extends Supabase auth)
- **habits** - User's habits (name, category, difficulty)
- **habit_logs** - Completion records (when, XP earned)
- **user_stats** - XP and levels per category

### RPG Tables
- **characters** - User's pixel warrior (stats, HP, gold, battle state)
- **gear** - Inventory (weapons, armor, accessories with stat bonuses)
- **monsters** - Global monster templates (level, stats, loot tables)
- **battle_log** - Combat history (victories, defeats, rewards)
- **achievements** - Unlocked milestones (future)

### Categories
- 🏃 **Health** - Workouts, sleep, nutrition
- 🧠 **Mind** - Reading, meditation, learning
- 💰 **Wealth** - Side hustle, saving, skills
- 🤝 **Social** - Friends, family, networking

---

## 🎮 Core Mechanics

### The Loop
1. **Complete real-life habits** → Earn XP
2. **XP fuels your character** → Stats increase based on habit category
3. **Your warrior auto-battles monsters** → Idle progression while you live your life
4. **Check in to collect loot** → Gear, gold, level-ups
5. **Stronger character = harder monsters = better rewards** → Positive feedback loop

### Habit → Character Stat Mapping
- 🏃 **Health habits** → Strength (melee damage)
- 🧠 **Mind habits** → Intelligence (magic damage)
- 💰 **Wealth habits** → Luck (rare loot drops, gold bonus)
- 🤝 **Social habits** → Charisma (NPC interactions, future features)

### XP System
- Base XP = `difficulty × 10`
- XP goes to both **user stats** (category levels) and **character total XP**
- Character level = `floor(sqrt(total_xp / 100)) + 1`
- Each category level increases corresponding stat by 5 points

### Idle Battle System
- Character **auto-fights monsters** every 5 minutes (background process)
- Battle outcome based on character stats vs monster stats
- Victory = XP, gold, chance for loot drops
- Defeat = reduced HP, must heal before next battle
- Check app to see battle log and collect rewards

### Gear & Loot
- **5 gear slots:** Weapon, Armor, Helmet, Boots, Accessory
- **Rarity tiers:** Common, Uncommon, Rare, Epic, Legendary
- Each piece gives stat bonuses (e.g., +10 Attack Power, +5 Defense)
- Loot drops from defeating monsters
- Equip best gear to make your character unstoppable

### Monsters
- 6+ monster types (Slime, Goblin, Wolf, Orc, Dark Knight, Dragon)
- Monsters scale with character level
- Each has unique loot tables
- Harder monsters = better rewards

### AI Coach (Future)
- Daily insights based on habits + RPG progress
- "Your warrior needs more Strength to defeat the Dragon. Hit the gym 3 more times this week!"
- Personalized quest suggestions

---

## 🛠️ Tech Stack

### App
- React Native (Expo)
- React Navigation
- Supabase Client
- NativeWind (Tailwind for RN)

### Server
- Node.js + Express
- Supabase (Postgres + Auth + RLS)
- Redis (planned - leaderboards)

### Shared
- TypeScript types

---

## 📝 API Endpoints

### Habits
- `GET /api/habits` - List user's habits
- `POST /api/habits` - Create new habit
- `POST /api/habits/:id/complete` - Mark habit done (awards XP + updates character)
- `PATCH /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Archive habit

### Character
- `GET /api/character` - Get character + equipped gear
- `PATCH /api/character/name` - Update character name
- `GET /api/character/gear` - Get full gear inventory
- `POST /api/character/gear/:id/equip` - Equip/unequip gear

### Battles
- `GET /api/battles/log` - View battle history
- `POST /api/battles/start` - Start a new battle (manual for now)
- `POST /api/battles/resolve` - Resolve current battle (auto-combat simulation)
- `GET /api/battles/monsters` - List all available monsters

### Stats
- `GET /api/stats` - User XP, levels, progress per category

### AI
- `GET /api/ai/insight` - Daily AI coach message

---

## 🎯 MVP Roadmap (2 Weeks)

### Week 1: Habits → Character → Battles
- [x] Supabase schema (core + RPG tables)
- [x] Server API (habits, character, battles)
- [x] XP → character stat syncing
- [x] Idle battle simulation engine
- [ ] Mobile app login screen
- [ ] Habit list + daily check-in UI
- [ ] Character screen (stats, HP, gold)
- [ ] Battle log UI (text-based for now)
- [ ] Pixel art sprites (character + 6 monsters)

### Week 2: Loot + Polish + Idle Loop
- [ ] Gear inventory UI
- [ ] Equip/unequip gear flow
- [ ] Loot drop animations
- [ ] Auto-battle background service (5-min intervals)
- [ ] Push notifications ("Your warrior defeated a Dragon!")
- [ ] Daily quests (AI picks 3 habits, frames as quests)
- [ ] Social sharing (export "my warrior" card)

## 🎨 Visual Style

**Pixel Art Aesthetic**
- 16x16 or 32x32 sprites for characters and monsters
- Retro RPG feel (inspired by classic JRPGs)
- Simple animations (idle, attack, victory)
- UI elements: pixel-style buttons, borders, fonts

**Color Palette**
- Dark mode optimized (deep blues, purples)
- Bright accent colors for rarity tiers (gray → green → blue → purple → gold)
- Health bars, XP bars with gradient fills

**Tools for Assets**
- Aseprite (pixel art editor)
- Piskel (browser-based alternative)
- itch.io / OpenGameArt for free sprite packs (temp assets for MVP)

---

## 🚢 Deployment

### Server
- Railway / Render / Fly.io
- Set env vars from `.env.example`

### App
- EAS Build (Expo Application Services)
- TestFlight (iOS) / Internal Testing (Android)

---

## 💡 Future Features

### Core Features
- **Advanced AI coach** - predictive scheduling, habit stacking, failure prevention
- **Guilds** - team up with friends, shared boss fights
- **PvP battles** - challenge friends to duels
- **Skill trees** - unlock special abilities per category
- **Partner rewards** - discounts from brands (fitness, books, courses)
- **Seasonal events** - limited-time monsters + exclusive loot

### Stretch Goals (Wearables)
- 🍎 **Apple Watch companion app**
  - Glance at battles in progress
  - Quick habit check-in (tap to complete)
  - Live HP/XP bars on watch face
  - Haptic feedback on level-up
  
- 🤖 **WearOS companion app**
  - Same features as Apple Watch
  - Optimized for Wear OS UI

- 🥽 **Rokid AI Glasses companion app** (The coolest stretch goal)
  - AR warrior fighting in your field of view
  - See your character training while you work out
  - Real-time battle notifications in AR overlay
  - "Boss approaching" alerts during your gym session
  - Voice commands: "Hex, start a battle" / "Hex, check my stats"

---

## 🤝 Contributing

This is a personal project by [@internethokage](https://github.com/internethokage). Not accepting contributions at this time.

---

## 📄 License

MIT License - see LICENSE file

---

**Built with 🔷 by Tre & Hex**
