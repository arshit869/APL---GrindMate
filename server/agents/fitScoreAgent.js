// Agent 7 — Fit Score Agent
// Computes Fit Score, updates dating visibility + rankings

import { getUser, getAllUsers, updateUser, logAgentActivity } from '../state.js';

/*
Fit Score (0–1000) =
  (daily completion rate × 0.30) +
  (streak length score × 0.20) +
  (challenge win rate × 0.20) +
  (difficulty accepted × 0.15) +
  (community rank percentile × 0.15)

Score decays 5 points/day without a check-in.
Dating unlock threshold: Score ≥ 300.
*/

function calculateCompletionScore(history) {
  if (!history || history.length === 0) return 0;
  const last30 = history.slice(-30);
  const completed = last30.filter(d => d.completed).length;
  return (completed / last30.length) * 1000;
}

function calculateStreakScore(streak) {
  // Logarithmic scaling: rewards longer streaks but with diminishing returns
  if (streak <= 0) return 0;
  return Math.min(1000, Math.log2(streak + 1) * 200);
}

function calculateChallengeScore(user) {
  const wins = user.challengeWins || 0;
  const total = user.challengeTotal || Math.max(wins, 1);
  return (wins / total) * 1000;
}

function calculateDifficultyScore(user) {
  const diffMap = { Recovery: 200, Easy: 400, Medium: 600, Hard: 800, Legendary: 1000 };
  return diffMap[user.difficulty] || 500;
}

function calculateCommunityRank(userId) {
  const allUsers = getAllUsers();
  if (allUsers.length <= 1) return 1000;
  const sorted = [...allUsers].sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
  const rank = sorted.findIndex(u => u.id === userId);
  return ((allUsers.length - rank) / allUsers.length) * 1000;
}

export function fitScoreAgent(userId, io) {
  const user = getUser(userId);
  if (!user) return null;

  const completionScore = calculateCompletionScore(user.history);
  const streakScore = calculateStreakScore(user.streak || 0);
  const challengeScore = calculateChallengeScore(user);
  const difficultyScore = calculateDifficultyScore(user);
  const communityScore = calculateCommunityRank(userId);

  const rawScore = 
    (completionScore * 0.30) +
    (streakScore * 0.20) +
    (challengeScore * 0.20) +
    (difficultyScore * 0.15) +
    (communityScore * 0.15);

  const newScore = Math.round(Math.min(1000, Math.max(0, rawScore)));
  const oldScore = user.fitScore || 0;
  const delta = newScore - oldScore;

  // Update score history
  const today = new Date().toISOString().split('T')[0];
  const scoreHistory = user.scoreHistory || [];
  const lastEntry = scoreHistory[scoreHistory.length - 1];
  if (lastEntry && lastEntry.date === today) {
    lastEntry.score = newScore;
  } else {
    scoreHistory.push({ date: today, score: newScore });
  }

  // Determine tier
  let tier = 'Bronze';
  if (newScore >= 950) tier = 'Legend';
  else if (newScore >= 800) tier = 'Diamond';
  else if (newScore >= 600) tier = 'Platinum';
  else if (newScore >= 400) tier = 'Gold';
  else if (newScore >= 200) tier = 'Silver';

  // Dating visibility
  const datingVisible = newScore >= 300;
  const datingMultiplier = datingVisible ? Math.min(3, newScore / 300) : 0;

  updateUser(userId, {
    fitScore: newScore,
    tier,
    scoreHistory,
    datingVisible,
    datingMultiplier: Math.round(datingMultiplier * 100) / 100
  });

  const direction = delta > 0 ? '📈' : delta < 0 ? '📉' : '➡️';
  const activity = {
    agentName: 'Fit Score Agent',
    action: 'score_update',
    message: `${direction} ${user.name} ${delta >= 0 ? '+' : ''}${delta} runs (now ${newScore}) — ${tier}`,
    color: 'teal',
    icon: '📊',
    userId,
    breakdown: {
      completion: Math.round(completionScore),
      streak: Math.round(streakScore),
      challenges: Math.round(challengeScore),
      difficulty: Math.round(difficultyScore),
      community: Math.round(communityScore)
    }
  };

  logAgentActivity(activity);

  if (io) {
    io.emit('agent:activity', activity);
    io.emit('score:updated', {
      userId,
      score: newScore,
      delta,
      tier,
      datingVisible,
      datingMultiplier
    });
  }

  return {
    score: newScore,
    delta,
    tier,
    datingVisible,
    breakdown: activity.breakdown,
    activity
  };
}

// Apply score decay for inactive users
export function applyScoreDecay(io) {
  const allUsers = getAllUsers();
  const today = new Date().toISOString().split('T')[0];

  allUsers.forEach(user => {
    const lastCheckin = user.history?.[user.history.length - 1];
    if (!lastCheckin || lastCheckin.date !== today) {
      const decayedScore = Math.max(0, (user.fitScore || 0) - 5);
      if (decayedScore !== user.fitScore) {
        updateUser(user.id, { fitScore: decayedScore });
        if (io) {
          io.emit('score:decay', {
            userId: user.id,
            score: decayedScore,
            message: "Your score drops in 18h — don't ghost the gym"
          });
        }
      }
    }
  });
}
