// Agent 6 — Reward Agent
// Coins, badges, league promo, forfeit assignment

import { getUser, updateUser, logAgentActivity } from '../state.js';

const TIER_THRESHOLDS = {
  Bronze: { min: 0, max: 199 },
  Silver: { min: 200, max: 399 },
  Gold: { min: 400, max: 599 },
  Platinum: { min: 600, max: 799 },
  Diamond: { min: 800, max: 949 },
  Legend: { min: 950, max: 1000 }
};

const BADGE_CRITERIA = {
  'Beast Mode': (u) => u.streak >= 7,
  'Comeback Kid': (u) => {
    const h = u.history || [];
    const recent5 = h.slice(-5);
    const older = h.slice(-10, -5);
    return recent5.filter(d => d.completed).length >= 4 && older.filter(d => d.completed).length <= 2;
  },
  'Consistency King': (u) => u.streak >= 30,
  'Challenge Crusher': (u) => (u.challengeWins || 0) >= 10,
  'Social Magnet': (u) => (u.matchCount || 0) >= 3
};

const FORFEIT_TYPES = [
  'public_apology',
  'cringe_profile_pic',
  'virtual_coffee',
  'pushup_challenge',
  'roast_confession',
  'fake_expert_title'
];

export function rewardAgent(userId, eventType, io) {
  const user = getUser(userId);
  if (!user) return null;

  const rewards = { coins: 0, badges: [], tierChange: null, forfeit: null };

  // Check for new badges
  const currentBadges = user.badges || [];
  for (const [badge, check] of Object.entries(BADGE_CRITERIA)) {
    if (!currentBadges.includes(badge) && check(user)) {
      rewards.badges.push(badge);
      rewards.coins += 100;
    }
  }

  // Check tier promotion/demotion
  const score = user.fitScore || 0;
  let newTier = 'Bronze';
  for (const [tier, range] of Object.entries(TIER_THRESHOLDS)) {
    if (score >= range.min && score <= range.max) {
      newTier = tier;
      break;
    }
  }
  if (score >= 950) newTier = 'Legend';

  if (newTier !== user.tier) {
    const tiers = Object.keys(TIER_THRESHOLDS);
    const oldIdx = tiers.indexOf(user.tier);
    const newIdx = tiers.indexOf(newTier);
    rewards.tierChange = {
      from: user.tier,
      to: newTier,
      promoted: newIdx > oldIdx
    };
  }

  // Check forfeit (miss 3+ consecutive days)
  if (eventType === 'check_miss') {
    const history = user.history || [];
    const last3 = history.slice(-3);
    const missedAll = last3.length >= 3 && last3.every(d => !d.completed);
    if (missedAll || user.streak === 0) {
      rewards.forfeit = FORFEIT_TYPES[Math.floor(Math.random() * FORFEIT_TYPES.length)];
    }
  }

  // Apply rewards
  const allBadges = [...currentBadges, ...rewards.badges];
  updateUser(userId, {
    badges: allBadges,
    coins: (user.coins || 0) + rewards.coins,
    tier: newTier
  });

  // Log activities
  const activities = [];

  if (rewards.badges.length > 0) {
    const activity = {
      agentName: 'Reward Agent',
      action: 'badge_awarded',
      message: `🏆 ${user.name} earned: ${rewards.badges.join(', ')}`,
      color: 'gold',
      icon: '🏆',
      userId
    };
    logAgentActivity(activity);
    activities.push(activity);
    if (io) io.emit('agent:activity', activity);
  }

  if (rewards.tierChange) {
    const activity = {
      agentName: 'Reward Agent',
      action: rewards.tierChange.promoted ? 'league_promotion' : 'league_demotion',
      message: rewards.tierChange.promoted
        ? `🏏 ${user.name} promoted: ${rewards.tierChange.from} → ${rewards.tierChange.to}!`
        : `📉 ${user.name} relegated: ${rewards.tierChange.from} → ${rewards.tierChange.to}`,
      color: 'gold',
      icon: rewards.tierChange.promoted ? '⬆️' : '⬇️',
      userId
    };
    logAgentActivity(activity);
    activities.push(activity);
    if (io) {
      io.emit('agent:activity', activity);
      io.emit('league:promotion', { userId, ...rewards.tierChange });
    }
  }

  if (rewards.forfeit) {
    const activity = {
      agentName: 'Reward Agent',
      action: 'forfeit_assigned',
      message: `💀 ${user.name} forfeited: ${rewards.forfeit.replace(/_/g, ' ')}`,
      color: 'coral',
      icon: '💀',
      userId
    };
    logAgentActivity(activity);
    activities.push(activity);
    if (io) {
      io.emit('agent:activity', activity);
      io.emit('forfeit:assigned', { userId, forfeitType: rewards.forfeit });
    }
  }

  return { rewards, activities };
}
