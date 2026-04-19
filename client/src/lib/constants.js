// Constants for GRINDMATE

export const COLORS = {
  void: '#0D0D0D',
  voidLight: '#1A1A2E',
  grindPink: '#FF3366',
  neonTeal: '#00E5B4',
  gold: '#FFD700',
  beastPurple: '#7B2FBE',
  coral: '#FF6B6B',
  amber: '#F59E0B',
};

export const TIERS = {
  Bronze: { min: 0, max: 199, color: '#CD7F32', bg: 'tier-bronze', icon: 'B' },
  Silver: { min: 200, max: 399, color: '#C0C0C0', bg: 'tier-silver', icon: 'S' },
  Gold: { min: 400, max: 599, color: '#FFD700', bg: 'tier-gold', icon: 'G' },
  Platinum: { min: 600, max: 799, color: '#00CED1', bg: 'tier-platinum', icon: 'P' },
  Diamond: { min: 800, max: 949, color: '#4169E1', bg: 'tier-diamond', icon: 'D' },
  Legend: { min: 950, max: 1000, color: '#FFD700', bg: 'tier-legend', icon: 'L' },
};

export const AGENT_COLORS = {
  'Goal Agent': { color: COLORS.neonTeal, class: 'agent-teal' },
  'Check-in Agent': { color: COLORS.neonTeal, class: 'agent-teal' },
  'Adaptive Agent': { color: COLORS.amber, class: 'agent-amber' },
  'Challenge Agent': { color: COLORS.amber, class: 'agent-amber' },
  'Roast Agent': { color: COLORS.coral, class: 'agent-coral' },
  'Match Agent': { color: COLORS.beastPurple, class: 'agent-purple' },
  'Reward Agent': { color: COLORS.gold, class: 'agent-gold' },
  'Fit Score Agent': { color: COLORS.neonTeal, class: 'agent-teal' },
};

export const WORKOUT_TYPES = ['Gym', 'Run', 'Cycle', 'Yoga', 'Walk', 'Other'];

export const BADGE_INFO = {
  'Beast Mode': { icon: '🔥', description: '7-day perfect streak', color: COLORS.grindPink },
  'Comeback Kid': { icon: '🦅', description: '5 days after a miss', color: COLORS.neonTeal },
  'Consistency King': { icon: '👑', description: '30-day completion', color: COLORS.gold },
  'Challenge Crusher': { icon: '⚡', description: '10 wins in a row', color: COLORS.amber },
  'Double Agent': { icon: '🕵️', description: 'Undetected in traitor mode', color: COLORS.beastPurple },
  'Social Magnet': { icon: '💜', description: '3 matches via GrindMatch', color: COLORS.beastPurple },
};

export const FUNNY_TITLES = {
  Oracle: '🔮 Oracle — top predictor + performer',
  'Boundary Merchant': '🏏 Boundary Merchant — peaked week 1',
  Overthinker: '🧠 Overthinker — high goals, low completion',
  'Ghost Mode': '👻 Ghost Mode — disappeared after day 3',
  'Try-Hard': '💪 Try-Hard — max effort, mid results',
  'Sleeping Giant': '🐉 Sleeping Giant — strong finish only',
};

export const FORFEIT_LABELS = {
  public_apology: '📢 Public apology post to squad',
  cringe_profile_pic: '🤡 Cringe profile pic for 24h',
  virtual_coffee: '☕ Buy the squad virtual coffee',
  pushup_challenge: '💪 Post 20-pushup video challenge',
  roast_confession: '🔥 Roast Agent writes your confession',
  fake_expert_title: '🤓 "Fake Expert" title for 48h',
};

export const API_BASE = '';
