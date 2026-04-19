// Agent 3 — Adaptive Agent
// Adjusts difficulty curve from 7-day performance trend

import { getUser, updateUser, logAgentActivity } from '../state.js';

export function adaptiveAgent(userId, io) {
  const user = getUser(userId);
  if (!user) return null;

  const history = user.history || [];
  const last7 = history.slice(-7);
  const completedDays = last7.filter(d => d.completed).length;
  const avgCompletion = completedDays / Math.max(last7.length, 1);

  const avgRuns = last7.reduce((sum, d) => sum + (d.runs || 0), 0) / Math.max(last7.length, 1);
  const avgDuration = last7.filter(d => d.completed).reduce((sum, d) => sum + (d.duration || 0), 0) / Math.max(completedDays, 1);

  let difficulty;
  let adjustment;

  if (avgCompletion >= 0.9 && avgRuns > 60) {
    difficulty = 'Hard';
    adjustment = 'up';
  } else if (avgCompletion >= 0.7) {
    difficulty = 'Medium';
    adjustment = 'maintain';
  } else if (avgCompletion >= 0.4) {
    difficulty = 'Easy';
    adjustment = 'down';
  } else {
    difficulty = 'Recovery';
    adjustment = 'recovery';
  }

  const messages = {
    up: `📈 ${user.name} is crushing it (${Math.round(avgCompletion * 100)}% completion, avg ${Math.round(avgRuns)} runs). Difficulty bumped to ${difficulty}.`,
    maintain: `📊 ${user.name} holding steady at ${Math.round(avgCompletion * 100)}% completion. Keeping ${difficulty} difficulty.`,
    down: `📉 ${user.name} at ${Math.round(avgCompletion * 100)}% completion. Easing to ${difficulty} to rebuild momentum.`,
    recovery: `🛌 ${user.name} needs a reset at ${Math.round(avgCompletion * 100)}% completion. Recovery mode activated.`
  };

  updateUser(userId, { difficulty, avgCompletion: Math.round(avgCompletion * 100) });

  const activity = {
    agentName: 'Adaptive Agent',
    action: 'adjust_difficulty',
    message: messages[adjustment],
    color: 'amber',
    icon: '📈',
    userId
  };

  logAgentActivity(activity);

  if (io) {
    io.emit('agent:activity', activity);
  }

  return {
    difficulty,
    adjustment,
    avgCompletion: Math.round(avgCompletion * 100),
    avgRuns: Math.round(avgRuns),
    avgDuration: Math.round(avgDuration),
    activity
  };
}
