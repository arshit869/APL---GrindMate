// Agent 1 — Goal Agent
// Sets personalized weekly targets from history + league tier

import { getUser, updateUser, logAgentActivity } from '../state.js';

const tierMultipliers = {
  Bronze: 0.7,
  Silver: 0.85,
  Gold: 1.0,
  Platinum: 1.15,
  Diamond: 1.3,
  Legend: 1.5
};

export function goalAgent(userId, io) {
  const user = getUser(userId);
  if (!user) return null;

  const history = user.history || [];
  const last7 = history.slice(-7);
  const completedDays = last7.filter(d => d.completed).length;
  const avgCompletion = completedDays / Math.max(last7.length, 1);

  const multiplier = tierMultipliers[user.tier] || 1.0;

  // Adaptive targeting: raise bar for high performers, lower for struggling
  let dailyTarget;
  if (avgCompletion > 0.85) {
    dailyTarget = Math.round(100 * multiplier * 1.1);
  } else if (avgCompletion > 0.6) {
    dailyTarget = Math.round(100 * multiplier);
  } else {
    dailyTarget = Math.round(100 * multiplier * 0.85);
  }

  const goal = {
    daily: dailyTarget,
    type: 'runs',
    message: `Your target: ${dailyTarget} runs today`,
    completionRate: Math.round(avgCompletion * 100)
  };

  updateUser(userId, { goals: goal });

  const activity = {
    agentName: 'Goal Agent',
    action: 'set_goal',
    message: `🎯 ${user.name} target set: ${dailyTarget} runs today (${Math.round(avgCompletion * 100)}% avg completion)`,
    color: 'teal',
    icon: '🎯',
    userId
  };

  logAgentActivity(activity);

  if (io) {
    io.emit('agent:activity', activity);
  }

  return { goal, activity };
}
