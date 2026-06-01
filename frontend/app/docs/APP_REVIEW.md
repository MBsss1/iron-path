# Iron Path — App Review (v1)

## Current Architecture

Iron Path is a client-side Next.js app (`output: "export"`) with a single-page orchestrator at `app/page.tsx`. Navigation is state-driven (`screen` string) rather than file-based routes. All game state persists in `localStorage` via `safeGet` / `safeSet`.

```
app/page.tsx          → orchestrator (hooks, handlers, routing)
app/components/*      → screens and popups
app/hooks/*           → persisted game state
app/data/*            → static game rules (ranks, achievements, programs)
app/utils/*           → storage, haptics, migrations, achievement progress
```

## Screens

| Screen | Route key | Access |
|--------|-----------|--------|
| Hero | `hero` | Bottom nav |
| Today | `today` | Bottom nav |
| Training | `training` | Bottom nav |
| Nutrition | `nutrition` | Bottom nav |
| More | `more` | Bottom nav |
| Progress | `progress` | More |
| Achievements | `achievements` | More |
| Legacy | `legacy` | More |
| Strength Tracker | `strength` | More |
| Profile | `profile` | More |
| Stats | `stats` | More |
| Settings | `settings` | More |
| Onboarding | — | When no profile |

## Hooks

| Hook | Purpose |
|------|---------|
| `usePlayer` | XP, level, week, body/mind/work, workouts, achievements |
| `useProfile` | User profile (versioned storage) |
| `useDailyMissions` | Daily mission checklist |
| `useDailyRewards` | 7-day login reward cycle |
| `useStats` | Aggregate stats (streaks, missions, start date) |
| `useSeasons` | Completed 24-week seasons |
| `useBossTrials` | Boss trial completion |
| `useStrengthTracker` | Strength metrics |
| `useWeightProgress` | Weight history |

## Storage Keys

Centralized in `app/utils/storageKeys.ts`:

| Key | Data |
|-----|------|
| `iron-path-player` | Player stats |
| `iron-path-profile` | Versioned profile |
| `iron-path-achievements` | Unlocked achievement IDs |
| `iron-path-daily-rewards` | Login reward streak |
| `iron-path-daily-missions` | Today's missions |
| `iron-path-boss-trials` | Completed trials |
| `iron-path-seasons` | Season records |
| `iron-path-strength` | Strength tracker |
| `iron-path-weight-progress` | Weight progress |
| `iron-path-stats` | Aggregate stats (v1) |

Reset via Settings calls `clearAllGameData()` to wipe all keys.

## Game Systems

- **XP & Levels** — 500 XP per level; `addXp` from workouts, missions, daily rewards, boss trials, seasons
- **24-Week Program** — Generated from profile goal + week via `generateProgram`
- **Daily Missions** — Workout, deep work, protein, sleep (reset daily)
- **Daily Login Rewards** — 7-day reward cycle (50–300 XP)
- **Boss Trials** — Triggered at weeks 4, 10, 18, 24
- **Seasons** — Complete at week 24; legacy badge + achievements
- **Achievements** — 14 milestones across 5 categories with progress tracking

## Known Issues

1. **Onboarding** still writes flat profile JSON; migrated on load by `migrateProfile()`
2. **Nutrition screen** uses static mock data (not persisted)
3. **Streak calendar** on Hero is decorative (not tied to login streak data)
4. **Login streak** increments on app load with profile, not only on daily claim
5. **Mission history** counts forward from v1 stats key (no retroactive count)
6. **iOS haptics** limited (Vibration API not fully supported)

## Future Roadmap

- Server sync / account backup
- Real nutrition logging
- Workout history log
- Push notifications for daily rewards
- PWA offline service worker
- Cloudflare deployment with OpenNext
- Retroactive achievement backfill from save data
- Streak calendar wired to real login data
