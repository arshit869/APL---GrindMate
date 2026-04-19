import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addUser, getUser, addSquad, getSquad } from '../state.js';
import { goalAgent } from '../agents/goalAgent.js';

const router = Router();

router.post('/register', (req, res) => {
  const { name, goalType, favoriteWorkout, squadCode, createSquad: createNew } = req.body;
  
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const userId = 'u_' + uuidv4().slice(0, 8);
  let squadId;

  if (createNew) {
    squadId = 's_' + uuidv4().slice(0, 8);
    addSquad({
      id: squadId,
      name: createNew === true ? `${name}'s Squad` : createNew,
      members: [userId],
      createdAt: new Date().toISOString(),
      dailyChallenge: null,
      forfeits: [],
      roasts: []
    });
  } else if (squadCode) {
    const squad = getSquad(squadCode);
    if (squad) {
      squadId = squadCode;
      squad.members.push(userId);
    } else {
      squadId = 's1'; // Fallback to Iron Legion
      const s = getSquad('s1');
      if (s) s.members.push(userId);
    }
  } else {
    squadId = 's1';
    const s = getSquad('s1');
    if (s) s.members.push(userId);
  }

  const user = {
    id: userId,
    name,
    fitScore: 0,
    tier: 'Bronze',
    streak: 0,
    squadId,
    goalType: goalType || 'General',
    favoriteWorkout: favoriteWorkout || 'Gym',
    goals: { daily: 50, type: 'runs' },
    todayProgress: 0,
    history: [],
    badges: [],
    funnyTitle: null,
    coins: 0,
    photo: null,
    profileRevealed: false,
    joinedAt: new Date().toISOString(),
    scoreHistory: []
  };

  addUser(user);

  const io = req.app.get('io');
  goalAgent(userId, io);
  
  if (io) {
    io.emit('user:joined', { userId, name, squadId });
  }

  res.json({ user, squadId });
});

router.post('/login', (req, res) => {
  const { userId } = req.body;
  const user = getUser(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

export default router;
