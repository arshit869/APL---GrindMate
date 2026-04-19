import { Router } from 'express';
import { getUser } from '../state.js';
import { checkinAgent } from '../agents/checkinAgent.js';
import { adaptiveAgent } from '../agents/adaptiveAgent.js';
import { rewardAgent } from '../agents/rewardAgent.js';
import { fitScoreAgent } from '../agents/fitScoreAgent.js';

const router = Router();

router.post('/checkin', async (req, res) => {
  const { userId, type, duration, intensity } = req.body;
  
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const user = getUser(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const io = req.app.get('io');

  // Run agent pipeline sequentially
  // Agent 2: Check-in validation
  const checkinResult = checkinAgent(userId, { type, duration, intensity }, io);

  // Agent 3: Adaptive difficulty
  const adaptiveResult = adaptiveAgent(userId, io);

  // Agent 6: Rewards check
  const rewardResult = rewardAgent(userId, 'checkin', io);

  // Agent 7: Fit Score update
  const scoreResult = fitScoreAgent(userId, io);

  res.json({
    success: true,
    checkin: checkinResult,
    adaptive: adaptiveResult,
    rewards: rewardResult?.rewards,
    score: scoreResult
  });
});

export default router;
