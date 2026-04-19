// Agent 5 — Roast + Match Agent (Claude API)
// Squad trash talk + AI-generated match conversation starters

import { getUser, getSquad, logAgentActivity } from '../state.js';
import { callClaude, isClaudeAvailable } from '../claudeClient.js';

const mockRoasts = [
  "LazyKaran99 missed day 3 again. Even the umpire runs more than this guy.",
  "2,000 steps? That's the distance from your bed to the fridge. Not a workout.",
  "Arshit_Grind is on a 14-day streak. The rest of you are playing gully cricket while he's in the IPL.",
  "BeastModeRaj did 200 pushups today. LazyKaran did 200 excuses. Same energy, different results.",
  "Your squad's average score dropped 15 points. That's not a dip, that's a collapse. Declare your innings.",
  "LazyKaran's streak counter is showing 0. Even the scoreboard is embarrassed.",
  "Priya_Lifts has a 21-day streak. She could play a full Test match while you can't last a T10.",
  "Your cardio today was walking to the fridge and back. The umpire gave that wide.",
  "BeastModeRaj's runs today: 75. LazyKaran's runs today: the runs he got from street food.",
  "The only muscle LazyKaran exercises is his thumb — scrolling through reels."
];

const mockOpeners = [
  "You both crushed 10K steps for 3 days straight. Coffee to celebrate, or are we turning it into a run? ☕🏃",
  "Matching workout times — both early risers. Sunrise run together this weekend? 🌅",
  "21-day streak meets 14-day streak. Combined total: unstoppable. Let's keep the innings going 🏏",
  "You both smashed leg day this week. Question is: who can hold a wall sit longer? Loser buys protein shakes 💪",
  "Two fitness freaks who actually show up — that's rarer than a double century. Let's train together 🔥"
];

export async function roastAgent(squadId, context, io) {
  const squad = getSquad(squadId);
  if (!squad) return null;

  const members = squad.members.map(id => getUser(id)).filter(Boolean);
  let roastText;

  if (isClaudeAvailable()) {
    try {
      const memberInfo = members.map(m =>
        `${m.name}: Fit Score ${m.fitScore}, ${m.streak}-day streak, tier: ${m.tier}`
      ).join('\n');

      const prompt = `You are the Roast Agent for a fitness squad called "${squad.name}". Generate a savage but funny roast about the squad's recent performance.

Squad members:
${memberInfo}

Context: ${context || 'General squad banter'}

Rules:
- Use cricket metaphors (runs, innings, ducks, umpire, etc.)
- Be funny and savage but not mean-spirited
- Call out the lowest performer specifically
- Keep it to 1-2 sentences max
- No emojis in the text itself

Return ONLY the roast text, no JSON, no quotes.`;

      const result = await callClaude(prompt);
      roastText = result.text || result;
      if (typeof roastText === 'object') roastText = JSON.stringify(roastText);
    } catch (err) {
      console.warn('Roast Agent Claude fallback:', err.message);
      roastText = mockRoasts[Math.floor(Math.random() * mockRoasts.length)];
    }
  } else {
    roastText = mockRoasts[Math.floor(Math.random() * mockRoasts.length)];
  }

  // Add to squad roast history
  const roastEntry = {
    text: roastText,
    timestamp: new Date().toISOString(),
    agentName: 'Roast Agent'
  };

  if (squad.roasts) {
    squad.roasts.unshift(roastEntry);
    if (squad.roasts.length > 20) squad.roasts = squad.roasts.slice(0, 20);
  } else {
    squad.roasts = [roastEntry];
  }

  const activity = {
    agentName: 'Roast Agent',
    action: 'roast',
    message: `🔥 ${roastText}`,
    color: 'coral',
    icon: '🔥',
    squadId,
    usedClaude: isClaudeAvailable()
  };

  logAgentActivity(activity);

  if (io) {
    io.emit('agent:activity', activity);
    io.emit('roast:new', { squadId, roast: roastEntry });
  }

  return { roast: roastEntry, activity };
}

export async function matchConversationAgent(user1Id, user2Id, io) {
  const user1 = getUser(user1Id);
  const user2 = getUser(user2Id);
  if (!user1 || !user2) return null;

  let opener;

  if (isClaudeAvailable()) {
    try {
      const prompt = `Generate a flirty, sporty conversation starter for two people who just completed a shared fitness challenge on a dating app.

Person 1: ${user1.name}, ${user1.favoriteWorkout} lover, ${user1.streak}-day streak, Fit Score: ${user1.fitScore}
Person 2: ${user2.name}, ${user2.favoriteWorkout} lover, ${user2.streak}-day streak, Fit Score: ${user2.fitScore}

Rules:
- Use cricket metaphors where possible
- Keep it under 2 sentences
- Fun, competitive but warm
- Reference their actual workout styles
- No emojis

Return ONLY the conversation opener text, no JSON, no quotes.`;

      const result = await callClaude(prompt);
      opener = result.text || result;
      if (typeof opener === 'object') opener = JSON.stringify(opener);
    } catch (err) {
      console.warn('Match Agent Claude fallback:', err.message);
      opener = mockOpeners[Math.floor(Math.random() * mockOpeners.length)];
    }
  } else {
    opener = mockOpeners[Math.floor(Math.random() * mockOpeners.length)];
  }

  const activity = {
    agentName: 'Match Agent',
    action: 'generate_opener',
    message: `💜 Match conversation unlocked: ${user1.name} ↔ ${user2.name}`,
    color: 'purple',
    icon: '💜',
    user1Id,
    user2Id,
    usedClaude: isClaudeAvailable()
  };

  logAgentActivity(activity);

  if (io) {
    io.emit('agent:activity', activity);
  }

  return { opener, activity };
}
