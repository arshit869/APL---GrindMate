// Agent 4 — Challenge Agent (Claude API)
// Generates daily micro-challenges for squad + community

import { getSquad, getUser, updateSquad, logAgentActivity } from '../state.js';
import { callClaude, isClaudeAvailable } from '../claudeClient.js';

const mockChallenges = [
  { challenge: '50 burpees before sunset', difficulty: 'high', runs: 60 },
  { challenge: 'Walk 15,000 steps today — no excuses', difficulty: 'medium', runs: 45 },
  { challenge: '3-minute plank hold — screenshot or it didn\'t happen', difficulty: 'high', runs: 55 },
  { challenge: '20 pushups every hour for 5 hours', difficulty: 'medium', runs: 50 },
  { challenge: '30-min HIIT session — go beast mode', difficulty: 'high', runs: 65 },
  { challenge: '100 squats in under 10 minutes', difficulty: 'medium', runs: 40 },
  { challenge: '5K run — rain or shine, no excuses', difficulty: 'high', runs: 70 },
  { challenge: '10-min meditation + 20-min yoga flow', difficulty: 'low', runs: 25 },
  { challenge: '200 jumping jacks between meetings', difficulty: 'low', runs: 30 },
  { challenge: 'Wall sit challenge: 3 sets of 60 seconds', difficulty: 'medium', runs: 35 }
];

export async function challengeAgent(squadId, io) {
  const squad = getSquad(squadId);
  if (!squad) return null;

  const members = squad.members.map(id => getUser(id)).filter(Boolean);
  const avgScore = members.reduce((sum, m) => sum + (m.fitScore || 0), 0) / Math.max(members.length, 1);

  let challenge;

  if (isClaudeAvailable()) {
    try {
      const prompt = `Generate a fun, competitive micro-challenge for a fitness squad called "${squad.name}".
Context:
- Squad has ${members.length} members
- Average Fit Score: ${Math.round(avgScore)}
- Member names: ${members.map(m => m.name).join(', ')}
- Previous challenge: ${squad.dailyChallenge?.challenge || 'None'}
- Use cricket language (runs instead of points, innings instead of streaks)

Return ONLY valid JSON (no markdown): { "challenge": "description", "difficulty": "low|medium|high", "runs": number_between_20_and_80 }`;

      challenge = await callClaude(prompt, true);
      if (!challenge.challenge) throw new Error('Invalid response format');
    } catch (err) {
      console.warn('Challenge Agent Claude fallback:', err.message);
      challenge = mockChallenges[Math.floor(Math.random() * mockChallenges.length)];
    }
  } else {
    challenge = mockChallenges[Math.floor(Math.random() * mockChallenges.length)];
  }

  challenge.generatedAt = new Date().toISOString();

  updateSquad(squadId, { dailyChallenge: challenge });

  const activity = {
    agentName: 'Challenge Agent',
    action: 'generate_challenge',
    message: `⚡ New squad challenge for ${squad.name}: "${challenge.challenge}" — ${challenge.runs} bonus runs`,
    color: 'amber',
    icon: '⚡',
    squadId,
    usedClaude: isClaudeAvailable()
  };

  logAgentActivity(activity);

  if (io) {
    io.emit('agent:activity', activity);
    io.emit('challenge:new', { squadId, challenge });
  }

  return { challenge, activity };
}

export async function generateMatchChallenge(user1, user2, io) {
  let challenge;

  if (isClaudeAvailable()) {
    try {
      const prompt = `Generate a fun 3-day shared fitness challenge for two people trying to match on a fitness dating app.

Person 1: ${user1.name} (${user1.favoriteWorkout} lover, ${user1.streak}-day streak, Fit Score: ${user1.fitScore})
Person 2: ${user2.name} (${user2.favoriteWorkout} lover, ${user2.streak}-day streak, Fit Score: ${user2.fitScore})

The challenge should be doable by both, take 3 days, and be fun. Use cricket language.

Return ONLY valid JSON (no markdown): { "challenge": "challenge description", "duration": 3, "dailyTarget": "what to do each day" }`;

      challenge = await callClaude(prompt, true);
      if (!challenge.challenge) throw new Error('Invalid');
    } catch (err) {
      challenge = {
        challenge: 'Both hit 10K steps for 3 days straight — no excuses, no shortcuts',
        duration: 3,
        dailyTarget: '10,000 steps minimum each day'
      };
    }
  } else {
    challenge = {
      challenge: 'Both hit 10K steps for 3 days straight — no excuses, no shortcuts',
      duration: 3,
      dailyTarget: '10,000 steps minimum each day'
    };
  }

  return challenge;
}
