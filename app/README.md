# QuestLog Mobile App

React Native (Expo) app for iOS and Android.

---

## Setup

```bash
cd app
npm install
```

## Run

```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web

# Development server
npm start
```

---

## Structure

```
app/
├── App.js                     # Main navigation (5 tabs)
├── src/
│   ├── screens/
│   │   ├── HabitsScreen.js    # Main view (habit tracking)
│   │   ├── CharacterScreen.js # Pixel warrior stats
│   │   ├── BattlesScreen.js   # Battle log + loot
│   │   ├── MapScreen.js       # Yggdrasil tree visualization
│   │   └── StatsScreen.js     # Category XP + skill trees
│   └── components/            # Reusable UI components (TBD)
├── assets/                    # Pixel art sprites (TBD)
└── package.json
```

---

## Screens

### 1. Habits (DEFAULT VIEW)
- **Purpose:** Core habit tracking experience
- **Features:**
  - Today's habit list (clean, fast)
  - One-tap completion → instant XP notification
  - Progress bar (X/Y completed today)
  - Floating action button (add habit)
- **Priority:** HIGHEST (80% of users will only use this screen)

### 2. Character
- **Purpose:** See your pixel warrior's progression
- **Features:**
  - Pixel sprite (placeholder: ⚔️)
  - HP/XP bars
  - Core stats (Strength, Intelligence, Luck, Charisma)
  - Combat stats (Attack, Defense, Gold)
  - Equipped gear (5 slots)
- **Priority:** HIGH (engaged users check daily)

### 3. Battles
- **Purpose:** Idle RPG reward layer
- **Features:**
  - Current battle status
  - Battle log (scrollable history)
  - Loot drops (gear acquired)
  - Victory/defeat visualization
- **Priority:** MEDIUM (for users who love the RPG aspect)

### 4. Map
- **Purpose:** Visual progression tracker
- **Features:**
  - Yggdrasil tree (vertical scroll)
  - 9 realm nodes (Helheim → Asgard)
  - Current realm highlighted
  - Locked realms grayed out
  - Tap realm → view monsters/lore
- **Priority:** MEDIUM (cool visual, but not essential)

### 5. Stats
- **Purpose:** Deep dive into progression
- **Features:**
  - Total XP earned
  - Category XP breakdown (Health/Mind/Wealth/Social)
  - Progress bars for each category
  - Links to: Skill Trees, Lore Codex, Achievements
- **Priority:** MEDIUM (power users)

---

## Design System

### Colors
```
Background:    #0f0f1e (near-black blue)
UI Dark:       #1a1a2e (dark blue-gray)
UI Mid:        #2d4059 (slate blue)
Accent:        #ffd700 (gold)

Health:        #d62828 (red)
Mind:          #4a7c59 (green)
Wealth:        #ffd700 (gold)
Social:        #f4e4c1 (cream)
```

### Typography
- Titles: 18-24px, bold, #fff
- Body: 14-16px, regular, #fff
- Meta: 12-14px, regular, #888

### Spacing
- Section padding: 20px
- Card padding: 16px
- Card margin: 12px
- Element spacing: 8-12px

---

## State Management

**Current:** Local state (useState) with mock data  
**Next:** Supabase integration via API calls

### API Endpoints (to wire up)
- `GET /api/habits` — Fetch habits
- `POST /api/habits/:id/complete` — Mark habit done, award XP
- `GET /api/character` — Fetch character + equipped gear
- `GET /api/battles/log` — Fetch battle history
- `GET /api/stats` — Fetch category XP/levels

---

## Next Steps

### Week 1 (Habit Flow Priority)
1. Wire up Supabase auth (login/signup)
2. Connect Habits screen to API
3. Implement habit completion flow with real XP
4. Add habit creation modal
5. Test end-to-end: create habit → complete → see XP → character updates

### Week 2 (RPG Layer)
1. Connect Character screen to API
2. Connect Battles screen to API
3. Add gear inventory UI
4. Build Yggdrasil map with realm progression
5. Add lore codex screen
6. Polish animations + transitions

---

## Philosophy

**Habit tracking is the core.**  
**RPG is the reward.**

The app should feel like:
- Duolingo (language is core, XP is reward)
- Strava (running is core, achievements are reward)
- **QuestLog (habits are core, pixel warrior is reward)**

Most users will never open Character/Battles/Map tabs. That's okay. The gamification still works via XP notifications.

For engaged users who want depth, the RPG layer is fully accessible but never required.

---

**Keep it simple. Keep it fast. 🔷**
