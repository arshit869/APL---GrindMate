import { addUser, addSquad, logAgentActivity, addArenaEvent, setBossChallenge } from './state.js';

function generateHistory(days, hitRate, baseRuns = 50) {
  const history = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const completed = Math.random() < hitRate;
    history.push({
      date: date.toISOString().split('T')[0],
      completed,
      runs: completed ? baseRuns + Math.floor(Math.random() * 30) : 0,
      workout: completed ? ['Gym', 'Run', 'Cycle', 'Yoga'][Math.floor(Math.random() * 4)] : null,
      duration: completed ? 30 + Math.floor(Math.random() * 90) : 0,
      intensity: completed ? ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] : null
    });
  }
  return history;
}

export function seedData() {
  // Demo squads
  addSquad({
    id: 's1',
    name: 'Iron Legion',
    members: ['u1', 'u2', 'u4'],
    createdAt: new Date().toISOString(),
    dailyChallenge: {
      challenge: '50 burpees before sunset',
      difficulty: 'high',
      runs: 60,
      generatedAt: new Date().toISOString()
    },
    forfeits: [
      { userId: 'u4', type: 'public_apology', reason: 'Missed 3 consecutive days', timestamp: new Date(Date.now() - 86400000).toISOString() }
    ],
    roasts: [
      { text: "LazyKaran99 missed day 3 again. Even the umpire runs more than him.", timestamp: new Date(Date.now() - 3600000).toISOString(), agentName: 'Roast Agent' },
      { text: "Arshit_Grind is on a 14-day streak. The rest of you are playing gully cricket while he's in the IPL.", timestamp: new Date(Date.now() - 7200000).toISOString(), agentName: 'Roast Agent' },
      { text: "BeastModeRaj did 200 pushups today. LazyKaran did 200 excuses.", timestamp: new Date(Date.now() - 10800000).toISOString(), agentName: 'Roast Agent' }
    ]
  });

  addSquad({
    id: 's2',
    name: 'Power Queens',
    members: ['u3'],
    createdAt: new Date().toISOString(),
    dailyChallenge: {
      challenge: '30-min yoga flow + 100 squats',
      difficulty: 'medium',
      runs: 45,
      generatedAt: new Date().toISOString()
    },
    forfeits: [],
    roasts: [
      { text: "Priya_Lifts has a 21-day streak. That's not a streak, that's a lifestyle.", timestamp: new Date(Date.now() - 1800000).toISOString(), agentName: 'Roast Agent' }
    ]
  });

  // Demo users
  addUser({
    id: 'u1',
    name: 'Arshit_Grind',
    fitScore: 847,
    tier: 'Diamond',
    streak: 14,
    squadId: 's1',
    goalType: 'Strength',
    favoriteWorkout: 'Gym',
    goals: { daily: 100, type: 'runs' },
    todayProgress: 82,
    history: generateHistory(30, 0.92, 55),
    badges: ['Beast Mode', 'Consistency King', 'Challenge Crusher'],
    funnyTitle: 'Oracle',
    coins: 2450,
    photo: null,
    profileRevealed: false,
    joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    scoreHistory: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      score: 600 + Math.floor(i * 8.5 + Math.random() * 15)
    }))
  });

  addUser({
    id: 'u2',
    name: 'BeastModeRaj',
    fitScore: 792,
    tier: 'Platinum',
    streak: 9,
    squadId: 's1',
    goalType: 'Endurance',
    favoriteWorkout: 'Run',
    goals: { daily: 120, type: 'runs' },
    todayProgress: 95,
    history: generateHistory(30, 0.85, 50),
    badges: ['Challenge Crusher', 'Comeback Kid'],
    funnyTitle: 'Try-Hard',
    coins: 1820,
    photo: null,
    profileRevealed: false,
    joinedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    scoreHistory: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      score: 550 + Math.floor(i * 8 + Math.random() * 20)
    }))
  });

  addUser({
    id: 'u3',
    name: 'Priya_Lifts',
    fitScore: 651,
    tier: 'Gold',
    streak: 21,
    squadId: 's2',
    goalType: 'Flexibility',
    favoriteWorkout: 'Yoga',
    goals: { daily: 80, type: 'runs' },
    todayProgress: 60,
    history: generateHistory(30, 0.88, 45),
    badges: ['Social Magnet', 'Comeback Kid', 'Beast Mode'],
    funnyTitle: 'Sleeping Giant',
    coins: 1350,
    photo: null,
    profileRevealed: false,
    joinedAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    scoreHistory: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      score: 400 + Math.floor(i * 8.5 + Math.random() * 12)
    }))
  });

  addUser({
    id: 'u4',
    name: 'LazyKaran99',
    fitScore: 184,
    tier: 'Bronze',
    streak: 0,
    squadId: 's1',
    goalType: 'Weight Loss',
    favoriteWorkout: 'Walk',
    goals: { daily: 50, type: 'runs' },
    todayProgress: 0,
    history: generateHistory(30, 0.25, 30),
    badges: [],
    funnyTitle: 'Ghost Mode',
    coins: 120,
    photo: null,
    profileRevealed: false,
    joinedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    scoreHistory: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      score: Math.max(100, 300 - Math.floor(i * 4 + Math.random() * 10))
    }))
  });

  // Seed agent activity log
  const agentActivities = [
    { agentName: 'Fit Score Agent', action: 'score_update', message: '🏏 Arshit_Grind scored +23 runs (now 847)', color: 'teal', icon: '📊' },
    { agentName: 'Challenge Agent', action: 'generate_challenge', message: '🏏 New squad challenge: 50 burpees before sunset — 60 bonus runs', color: 'amber', icon: '⚡' },
    { agentName: 'Roast Agent', action: 'roast', message: '🏏 LazyKaran99 missed day 3. Even the umpire runs more.', color: 'coral', icon: '🔥' },
    { agentName: 'Check-in Agent', action: 'validate_checkin', message: '🏏 BeastModeRaj checked in — Gym, 75 min, High intensity', color: 'teal', icon: '✅' },
    { agentName: 'Reward Agent', action: 'badge_awarded', message: '🏏 Arshit_Grind earned "Beast Mode" badge — 7-day innings complete', color: 'gold', icon: '🏆' },
    { agentName: 'Goal Agent', action: 'set_goal', message: '🏏 Priya_Lifts target adjusted: 80 runs today (up from 70)', color: 'teal', icon: '🎯' },
    { agentName: 'Adaptive Agent', action: 'adjust_difficulty', message: '🏏 BeastModeRaj difficulty bumped to Hard — 7-day avg 92%', color: 'amber', icon: '📈' },
  ];

  agentActivities.forEach((activity, i) => {
    logAgentActivity({
      ...activity,
      timestamp: new Date(Date.now() - i * 600000).toISOString()
    });
  });

  // Seed arena events
  addArenaEvent({
    id: 'ae1',
    title: '10K Steps City Challenge',
    description: 'Walk 10,000 steps every day for 7 days. City-wide bracket.',
    participants: 247,
    deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
    runs: 500,
    difficulty: 'medium',
    active: true
  });

  addArenaEvent({
    id: 'ae2',
    title: 'Plank Marathon',
    description: 'Accumulate 30 minutes of plank time this week.',
    participants: 132,
    deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
    runs: 300,
    difficulty: 'high',
    active: true
  });

  // Seed boss challenge
  setBossChallenge({
    id: 'boss1',
    title: '🔥 BOSS CHALLENGE: Iron Man Weekend',
    description: 'Complete 5 workouts in 48 hours. Any type. Minimum 30 minutes each.',
    runs: 500,
    difficulty: 'legendary',
    deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
    participants: 89,
    active: true
  });

  console.log('🏏 GRINDMATE seeded: 4 users, 2 squads, agent history, arena events');
}
