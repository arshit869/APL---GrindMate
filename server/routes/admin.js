import { Router } from 'express';
import { getUser, getAllUsers, getSquad, logAgentActivity, setBossChallenge, getBossChallenge, getAgentLog } from '../state.js';
import { checkinAgent } from '../agents/checkinAgent.js';
import { goalAgent } from '../agents/goalAgent.js';
import { adaptiveAgent } from '../agents/adaptiveAgent.js';
import { challengeAgent } from '../agents/challengeAgent.js';
import { roastAgent, matchConversationAgent } from '../agents/roastMatchAgent.js';
import { rewardAgent } from '../agents/rewardAgent.js';
import { fitScoreAgent } from '../agents/fitScoreAgent.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/admin/trigger', async (req, res) => {
  const { event, userId, squadId, data } = req.body;
  const io = req.app.get('io');

  try {
    let result;

    switch (event) {
      case 'checkin': {
        const targetUser = userId || 'u1';
        result = checkinAgent(targetUser, data || { type: 'Gym', duration: 60, intensity: 'High' }, io);
        // Run full pipeline
        adaptiveAgent(targetUser, io);
        rewardAgent(targetUser, 'checkin', io);
        fitScoreAgent(targetUser, io);
        break;
      }

      case 'roast': {
        const targetSquad = squadId || 's1';
        result = await roastAgent(targetSquad, data?.context || 'Admin triggered roast', io);
        break;
      }

      case 'challenge': {
        const targetSquad = squadId || 's1';
        result = await challengeAgent(targetSquad, io);
        break;
      }

      case 'forfeit': {
        const targetUser = userId || 'u4';
        result = rewardAgent(targetUser, 'check_miss', io);
        break;
      }

      case 'match_unlock': {
        const u1 = userId || 'u1';
        const u2 = data?.matchUserId || 'u3';
        result = await matchConversationAgent(u1, u2, io);
        
        if (io) {
          const user1 = getUser(u1);
          const user2 = getUser(u2);
          io.emit('match:unlocked', {
            match: {
              id: 'm_' + uuidv4().slice(0, 8),
              user1Id: u1,
              user2Id: u2,
              opener: result?.opener || "You both crushed it! Time to celebrate 💪",
              unlockedAt: new Date().toISOString()
            },
            user1: { id: u1, name: user1?.name, fitScore: user1?.fitScore },
            user2: { id: u2, name: user2?.name, fitScore: user2?.fitScore }
          });
        }
        break;
      }

      case 'boss_challenge': {
        const boss = {
          id: 'boss_' + uuidv4().slice(0, 8),
          title: '🔥 BOSS CHALLENGE: Iron Man Weekend',
          description: data?.description || 'Complete 5 workouts in 48 hours. Any type. Minimum 30 minutes each.',
          runs: 500,
          difficulty: 'legendary',
          deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
          participants: Math.floor(Math.random() * 200) + 50,
          active: true
        };
        setBossChallenge(boss);

        const activity = {
          agentName: 'Challenge Agent',
          action: 'boss_challenge',
          message: `🔥 BOSS CHALLENGE DROPPED: ${boss.title}`,
          color: 'amber',
          icon: '🔥'
        };
        logAgentActivity(activity);

        if (io) {
          io.emit('agent:activity', activity);
          io.emit('boss:dropped', boss);
        }
        result = boss;
        break;
      }

      case 'score_update': {
        const targetUser = userId || 'u1';
        result = fitScoreAgent(targetUser, io);
        break;
      }

      case 'goal_set': {
        const targetUser = userId || 'u1';
        result = goalAgent(targetUser, io);
        break;
      }

      default:
        return res.status(400).json({ error: `Unknown event type: ${event}` });
    }

    res.json({ success: true, event, result });
  } catch (err) {
    console.error('Admin trigger error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all state for admin view
router.get('/admin/state', (req, res) => {
  const allUsers = getAllUsers();
  const agentLog = getAgentLog(20);
  const bossChallenge = getBossChallenge();

  res.json({
    users: allUsers.map(u => ({
      id: u.id,
      name: u.name,
      fitScore: u.fitScore,
      tier: u.tier,
      streak: u.streak,
      coins: u.coins,
      squadId: u.squadId
    })),
    agentLog,
    bossChallenge
  });
});

export default router;
