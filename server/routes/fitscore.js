import { Router } from 'express';
import { getUser } from '../state.js';
import { fitScoreAgent } from '../agents/fitScoreAgent.js';

const router = Router();

router.get('/fitscore/:userId', (req, res) => {
  const user = getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    userId: user.id,
    fitScore: user.fitScore,
    tier: user.tier,
    streak: user.streak,
    datingVisible: (user.fitScore || 0) >= 300,
    scoreHistory: user.scoreHistory || [],
    breakdown: {
      completion: Math.round((user.history?.filter(d => d.completed).length || 0) / Math.max(user.history?.length || 1, 1) * 100),
      streak: user.streak,
      challengeWins: user.challengeWins || 0,
      difficulty: user.difficulty || 'Medium',
      badges: user.badges?.length || 0
    }
  });
});

router.post('/fitscore/:userId/recalc', (req, res) => {
  const io = req.app.get('io');
  const result = fitScoreAgent(req.params.userId, io);
  if (!result) return res.status(404).json({ error: 'User not found' });
  res.json(result);
});

export default router;
