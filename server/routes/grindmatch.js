import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllUsers, getUser, addChallenge, getChallenge, getChallengesForUser, addMatch, logAgentActivity } from '../state.js';
import { generateMatchChallenge } from '../agents/challengeAgent.js';
import { matchConversationAgent } from '../agents/roastMatchAgent.js';

const router = Router();

// Get compatible Fit Cards (users with score >= 300)
router.get('/grindmatch/cards', (req, res) => {
  const { userId } = req.query;
  const currentUser = userId ? getUser(userId) : null;

  const allUsers = getAllUsers().filter(u => {
    if (u.id === userId) return false;
    if ((u.fitScore || 0) < 300) return false;
    return true;
  });

  const cards = allUsers.map(u => ({
    id: u.id,
    name: u.name,
    fitScore: u.fitScore,
    streak: u.streak,
    tier: u.tier,
    goalType: u.goalType,
    favoriteWorkout: u.favoriteWorkout,
    badges: u.badges,
    funnyTitle: u.funnyTitle
    // NO photo — that's the whole point
  }));

  // Sort by compatibility (similar goals, close scores)
  if (currentUser) {
    cards.sort((a, b) => {
      const aCompat = (a.goalType === currentUser.goalType ? 100 : 0) - Math.abs(a.fitScore - currentUser.fitScore) / 10;
      const bCompat = (b.goalType === currentUser.goalType ? 100 : 0) - Math.abs(b.fitScore - currentUser.fitScore) / 10;
      return bCompat - aCompat;
    });
  }

  res.json({ cards, total: cards.length });
});

// Send a 3-day challenge to another user
router.post('/grindmatch/challenge', async (req, res) => {
  const { fromUserId, toUserId } = req.body;
  const fromUser = getUser(fromUserId);
  const toUser = getUser(toUserId);

  if (!fromUser || !toUser) return res.status(404).json({ error: 'User not found' });

  const io = req.app.get('io');

  // Generate challenge via Challenge Agent
  const matchChallenge = await generateMatchChallenge(fromUser, toUser, io);

  const challenge = addChallenge({
    id: 'ch_' + uuidv4().slice(0, 8),
    fromUserId,
    toUserId,
    challenge: matchChallenge,
    status: 'pending',
    daysCompleted: { [fromUserId]: 0, [toUserId]: 0 },
    createdAt: new Date().toISOString()
  });

  const activity = {
    agentName: 'Challenge Agent',
    action: 'match_challenge_sent',
    message: `💜 ${fromUser.name} challenged ${toUser.name} to: "${matchChallenge.challenge}"`,
    color: 'purple',
    icon: '💜'
  };
  logAgentActivity(activity);

  if (io) {
    io.emit('agent:activity', activity);
    io.emit('challenge:received', { challenge });
  }

  res.json({ challenge });
});

// Get challenges for a user
router.get('/grindmatch/challenges/:userId', (req, res) => {
  const challenges = getChallengesForUser(req.params.userId);
  res.json({ challenges });
});

// Unlock match (both completed challenge)
router.post('/grindmatch/unlock', async (req, res) => {
  const { challengeId } = req.body;
  const challenge = getChallenge(challengeId);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  const io = req.app.get('io');
  const user1 = getUser(challenge.fromUserId);
  const user2 = getUser(challenge.toUserId);

  // Generate conversation opener
  const matchResult = await matchConversationAgent(challenge.fromUserId, challenge.toUserId, io);

  const match = addMatch({
    id: 'm_' + uuidv4().slice(0, 8),
    user1Id: challenge.fromUserId,
    user2Id: challenge.toUserId,
    challengeId,
    opener: matchResult?.opener || "You both crushed it! Time to celebrate together 💪",
    unlockedAt: new Date().toISOString()
  });

  // Update challenge status
  challenge.status = 'completed';

  if (io) {
    io.emit('match:unlocked', {
      match,
      user1: { id: user1.id, name: user1.name, fitScore: user1.fitScore },
      user2: { id: user2.id, name: user2.name, fitScore: user2.fitScore }
    });
  }

  res.json({ match });
});

export default router;
