// Agent 2 — Check-in Agent
// Validates workouts via manual log, awards coins, updates streak

import { getUser, updateUser, logAgentActivity } from '../state.js';

const workoutRunsMap = {
  Gym: { Low: 30, Medium: 50, High: 70 },
  Run: { Low: 35, Medium: 55, High: 75 },
  Cycle: { Low: 25, Medium: 45, High: 65 },
  Yoga: { Low: 20, Medium: 35, High: 50 },
  Walk: { Low: 15, Medium: 25, High: 40 },
  Other: { Low: 20, Medium: 40, High: 60 }
};

export function checkinAgent(userId, workoutData, io) {
  const user = getUser(userId);
  if (!user) return null;

  const { type = 'Gym', duration = 60, intensity = 'Medium' } = workoutData;

  // Calculate runs earned
  const baseRuns = workoutRunsMap[type]?.[intensity] || 40;
  const durationMultiplier = Math.min(duration / 60, 2); // Cap at 2x for 120+ min
  const runs = Math.round(baseRuns * durationMultiplier);

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const lastCheckin = user.history?.[user.history.length - 1];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newStreak = user.streak || 0;
  if (!lastCheckin || lastCheckin.date !== today) {
    if (lastCheckin && lastCheckin.date === yesterday && lastCheckin.completed) {
      newStreak += 1;
    } else if (!lastCheckin || lastCheckin.date !== yesterday) {
      newStreak = 1; // Reset streak if gap
    }
  }

  // Award coins
  const coins = 50; // Base check-in reward
  let bonusCoins = 0;
  let streakMilestone = null;

  if (newStreak === 7) {
    bonusCoins = 100;
    streakMilestone = '7-DAY INNINGS — Test match mode';
  } else if (newStreak === 14) {
    bonusCoins = 200;
    streakMilestone = '14-DAY CENTURY — Beast form unlocked';
  } else if (newStreak === 30) {
    bonusCoins = 500;
    streakMilestone = '30-DAY DOUBLE TON — Legend status';
  }

  // Update user state
  const newHistory = [...(user.history || []), {
    date: today,
    completed: true,
    runs,
    workout: type,
    duration,
    intensity
  }];

  const updates = {
    streak: newStreak,
    coins: (user.coins || 0) + coins + bonusCoins,
    todayProgress: Math.min((user.todayProgress || 0) + runs, user.goals?.daily || 100),
    history: newHistory
  };

  updateUser(userId, updates);

  const activity = {
    agentName: 'Check-in Agent',
    action: 'validate_checkin',
    message: `✅ ${user.name} checked in — ${type}, ${duration} min, ${intensity} intensity → +${runs} runs, +${coins + bonusCoins} coins`,
    color: 'teal',
    icon: '✅',
    userId
  };

  logAgentActivity(activity);

  if (io) {
    io.emit('agent:activity', activity);
    io.emit('checkin:validated', {
      userId,
      runs,
      coins: coins + bonusCoins,
      streak: newStreak,
      streakMilestone,
      todayProgress: updates.todayProgress
    });
  }

  return {
    runs,
    coins: coins + bonusCoins,
    streak: newStreak,
    streakMilestone,
    activity,
    todayProgress: updates.todayProgress
  };
}
