# 🔷 QuestLog

**Turn your habits into XP. Level up your life.**

A gamified habit tracker that treats your life like an RPG. Complete habits to earn XP, level up in 4 categories (Health, Mind, Wealth, Social), and get AI-powered coaching to keep you on track.

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

### Tables
- **profiles** - User profiles (extends Supabase auth)
- **habits** - User's habits (name, category, difficulty)
- **habit_logs** - Completion records (when, XP earned)
- **user_stats** - XP and levels per category
- **achievements** - Unlocked milestones
- **friendships** - Social connections (future feature)

### Categories
- 🏃 **Health** - Workouts, sleep, nutrition
- 🧠 **Mind** - Reading, meditation, learning
- 💰 **Wealth** - Side hustle, saving, skills
- 🤝 **Social** - Friends, family, networking

---

## 🎮 Core Mechanics

### XP System
- Base XP = `difficulty × 10`
- Streak multiplier (future): up to 2x
- Level formula: `level = floor(sqrt(xp / 100)) + 1`

### Levels
- Level 1 → 2: 100 XP
- Level 2 → 3: 400 XP
- Level 10 → 11: 10,000 XP

### AI Coach (MVP)
- Canned motivational messages
- Future: Personalized insights, failure prediction, habit stacking

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
- `POST /api/habits/:id/complete` - Mark habit done (awards XP)
- `PATCH /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Archive habit

### Stats
- `GET /api/stats` - User XP, levels, progress

### AI
- `GET /api/ai/insight` - Daily AI coach message

---

## 🎯 MVP Roadmap (2 Weeks)

### Week 1: Core Flow
- [x] Supabase schema + migrations
- [x] Server API scaffolding
- [x] Basic habits CRUD
- [ ] XP calculation on completion
- [ ] Mobile app login screen
- [ ] Habit list + daily check-in UI

### Week 2: AI + Polish
- [ ] AI coach (1 daily insight)
- [ ] Daily quests (AI picks 3 habits)
- [ ] Leaderboard (friends only)
- [ ] Social sharing (export achievements)

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

- **Streak tracking** with visual fire emoji
- **Boss fights** - weekly challenges
- **Monthly raids** - community goals
- **Partner rewards** - discounts from brands
- **Bet on yourself** - put money on the line
- **Advanced AI** - predictive scheduling, failure prevention

---

## 🤝 Contributing

This is a personal project by [@internethokage](https://github.com/internethokage). Not accepting contributions at this time.

---

## 📄 License

MIT License - see LICENSE file

---

**Built with 🔷 by Tre & Hex**
