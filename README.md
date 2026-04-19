# GRINDMATE

**Your grind is your dating profile.**

A social fitness app where consistency, streaks, and challenge wins become your dating score.
Built for Google Agentic Premier League — Challenge 2: Fitness Consistency.

## Architecture

```
User → Landing → Dashboard ← Socket.IO ← Server
                    ↓                      ↓
                 Check-in              7 Agents
                    ↓                      ↓
             Squad / GrindMatch    (2 use Claude API)
```

## Quick Start

1. Clone repo
2. Install dependencies: `npm install && npm run install:all`
3. Create `.env` in root:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
4. Run both servers: `npm start`
5. Open http://localhost:5173

## 7 AI Agents (Sequential Pipeline)

1. **Goal Agent**: Sets personalized weekly targets.
2. **Check-in Agent**: Validates workouts and awards runs/coins.
3. **Adaptive Agent**: Adjusts difficulty based on performance.
4. **Challenge Agent (Claude API)**: Generates contextual squad challenges.
5. **Roast + Match Agent (Claude API)**: Handles trash talk and dating openers.
6. **Reward Agent**: Manages badges, tiers, and forfeits.
7. **Fit Score Agent**: Computes the core 0-1000 score.

## Features

- **Fit Score:** 0-1000 score = leaderboard rank + dating visibility multiplier.
- **Squad Wars:** Real-time competition, AI roasts, and daily challenges.
- **GrindMatch:** Fitness-first dating. Unlock photos only after a 3-day shared challenge.
- **Cricket Language:** "Runs" instead of points. Notifications styled as match updates.
- **Agent Activity Panel:** Real-time visibility into agent logic and actions.

## Demo Script (3-4 Minutes)

1. **Dashboard Hero (60s)**: Show the Fit Score ring and Streak flame. Point out the Agent Activity Panel firing in real-time.
2. **The Grind (60s)**: Perform a Check-in. Watch the coin rain, confetti, and score ring animation. "Beast mode activated!"
3. **Squad Social (60s)**: Move to Squad. Generate an AI Roast or Challenge. Show the leaderboard transition.
4. **The Differentiator (60s)**: Open GrindMatch. Show Fit Cards (no photos). Trigger a match unlock via the Admin panel to show the reveal animation and AI opener.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Framer Motion, Three.js (R3F), Recharts.
- **Backend**: Node.js, Express, Socket.IO.
- **Agents**: Claude API (Agents 4 & 5).
- **Data**: In-memory state (Seeded demo users included).

---

## Admin Panel

Access hidden route `/admin` to trigger any event on demand for the judges.
- Fire check-in
- Generate roasts/challenges
- Assign forfeits
- Unlock matches
