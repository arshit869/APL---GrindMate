import { Router } from 'express';
import { getSquad, getUser, getAllUsers } from '../state.js';
import { challengeAgent } from '../agents/challengeAgent.js';
import { roastAgent } from '../agents/roastMatchAgent.js';

const router = Router();

router.get('/squad/:squadId', (req, res) => {
  const squad = getSquad(req.params.squadId);
  if (!squad) return res.status(404).json({ error: 'Squad not found' });

  const members = squad.members.map(id => {
    const u = getUser(id);
    if (!u) return null;
    return {
      id: u.id,
      name: u.name,
      fitScore: u.fitScore,
      streak: u.streak,
      tier: u.tier,
      todayProgress: u.todayProgress,
      goals: u.goals,
      badges: u.badges,
      funnyTitle: u.funnyTitle
    };
  }).filter(Boolean);

  members.sort((a, b) => b.fitScore - a.fitScore);

  res.json({
    squad: {
      ...squad,
      members,
      memberCount: members.length
    }
  });
});

router.post('/squad/:squadId/challenge', async (req, res) => {
  const io = req.app.get('io');
  const result = await challengeAgent(req.params.squadId, io);
  if (!result) return res.status(404).json({ error: 'Squad not found' });
  res.json(result);
});

router.post('/squad/:squadId/roast', async (req, res) => {
  const io = req.app.get('io');
  const { context } = req.body;
  const result = await roastAgent(req.params.squadId, context, io);
  if (!result) return res.status(404).json({ error: 'Squad not found' });
  res.json(result);
});

export default router;
