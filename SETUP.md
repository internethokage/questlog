# QuestLog — Backend Setup Guide

> Wire up the server, connect Supabase, and hit your first API endpoints.

---

## Prerequisites

- **Node.js** 18+ (20 LTS recommended)
- **npm** 9+
- A **Supabase** project ([supabase.com](https://supabase.com))
- (Optional) **Redis** for leaderboards

---

## 1. Clone & Install

```bash
git clone https://github.com/internethokage/questlog.git
cd questlog

# Install root workspace dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install app dependencies
cd app && npm install && cd ..
```

---

## 2. Supabase Setup

### 2a. Create a Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a region close to your users
3. Note your **Project URL** and **anon public key** (Settings → API)

### 2b. Run Migrations

Run these SQL files **in order** in the **Supabase SQL Editor** (Dashboard → SQL Editor → New Query):

| Order | File | What it does |
|-------|------|-------------|
| 1 | `server/supabase/migrations/001_initial_schema.sql` | Core tables: profiles, habits, habit_logs, user_stats |
| 2 | `server/supabase/migrations/002_idle_rpg_system.sql` | Characters, gear, monsters, battle_log |
| 3 | `server/supabase/migrations/003_yggdrasil_progression.sql` | Realms, skill trees, lore codex |
| 4 | `server/supabase/migrations/004_habit_fundamentals.sql` | Streak tracking, `update_habit_streak` function |

> ⚠️ Run them in order — later migrations reference tables from earlier ones.

### 2c. (Optional) Disable Email Confirmation for Dev

Dashboard → Authentication → Providers → Email → **Disable "Confirm email"** for easier local dev.

---

## 3. Environment Variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co    # From Project Settings → API
SUPABASE_ANON_KEY=eyJ...                          # Anon/public key
SUPABASE_SERVICE_ROLE_KEY=eyJ...                  # (Optional) Service role key
```

> 🔐 **Never commit `.env` or expose `SUPABASE_SERVICE_ROLE_KEY`** — it bypasses all Row Level Security.

---

## 4. Run the Server

```bash
cd server
npm run dev        # Development (nodemon auto-reload)
# or
npm start          # Production
```

Server starts at: **http://localhost:3000**

Health check: `GET http://localhost:3000/health`

---

## 5. API Reference

All protected endpoints require:
```
Authorization: Bearer <supabase_access_token>
```

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/signin` | Sign in, get tokens |
| `POST` | `/api/auth/signout` | Invalidate session |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET`  | `/api/auth/me` | Get current user + profile |
| `PATCH`| `/api/auth/profile` | Update username/avatar/timezone |

**Signup:**
```json
POST /api/auth/signup
{
  "email": "tre@questlog.app",
  "password": "supersecure123",
  "username": "TreTheKeeper"
}
```

**Signin:**
```json
POST /api/auth/signin
{
  "email": "tre@questlog.app",
  "password": "supersecure123"
}
// Returns: { user, session: { access_token, refresh_token, expires_at } }
```

---

### Habits

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/habits` | List all habits (+ today's completion status) |
| `POST` | `/api/habits` | Create a habit (free: max 3) |
| `GET`  | `/api/habits/:id` | Get habit + recent logs |
| `POST` | `/api/habits/:id/complete` | Complete habit → earn XP |
| `PATCH`| `/api/habits/:id` | Update habit |
| `DELETE`| `/api/habits/:id` | Archive habit (soft delete) |

**Create a habit:**
```json
POST /api/habits
{
  "name": "Morning Run",
  "category": "health",     // health | mind | wealth | social
  "difficulty": 3,           // 1–5
  "frequency": "daily"       // daily | weekly
}
```

**Complete a habit:**
```json
POST /api/habits/:id/complete
{
  "notes": "5km personal best!"  // optional
}

// Returns:
{
  "xp_earned": 30,
  "streak": 7,
  "leveled_up": true,
  "new_level": 2,
  "stat_affected": "strength"
}
```

> **Free tier limit:** 3 active habits. Completing habits earns XP and updates your character stats automatically.

---

### Character

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/character` | Get character + equipped gear + realm info |
| `PATCH`| `/api/character/name` | Rename your character |
| `GET`  | `/api/character/gear` | Get gear inventory |
| `POST` | `/api/character/gear/:id/equip` | Equip/unequip item |

---

### Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/stats` | XP + level progress for all 4 categories |

---

### Battles (Idle RPG)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/battles/log` | Battle history |
| `GET`  | `/api/battles/monsters` | Available monsters |
| `POST` | `/api/battles/start` | Start a battle |
| `POST` | `/api/battles/resolve` | Auto-resolve current battle |

---

### AI Coach

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/ai/insight` | Daily coaching message based on habit activity |

---

## 6. Category → Stat Mapping

| Habit Category | RPG Stat | Effect |
|----------------|----------|--------|
| `health` | Strength | Physical attack power |
| `mind` | Intelligence | Magic / skill power |
| `wealth` | Luck | Loot chance, gold drops |
| `social` | Charisma | NPC interactions, guild buffs |

**XP → Level formula:** `level = floor(sqrt(xp / 100)) + 1`

**Streak bonus:** +10% XP per 7-day streak milestone (capped at +50%)

---

## 7. Free vs Pro

| Feature | Free | Pro ($7/mo) |
|---------|------|-------------|
| Active habits | 3 | Unlimited |
| Daily battles | 10 | Unlimited |
| AI insights | Basic | Advanced |
| Character slots | 1 | 3 |

Pro plan check is via `user.user_metadata.plan === 'pro'` — set this via Supabase Auth admin when payment is confirmed.

---

## 8. Troubleshooting

**"Missing required env vars"** → Check `server/.env` has `SUPABASE_URL` and `SUPABASE_ANON_KEY` set.

**"Invalid token"** → Token is expired. Call `POST /api/auth/refresh` with your `refresh_token`.

**"Habit not found"** → Make sure you're passing the correct UUID and the habit belongs to the authenticated user.

**RLS errors from Supabase** → Make sure you ran all 4 migrations. Row Level Security is enforced at the DB level.

---

Built with 🔷 by Hex | QuestLog v0.1.0
