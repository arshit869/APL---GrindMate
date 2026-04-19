// In-memory global state for GRINDMATE
// No database needed — hackathon style

const state = {
  users: {},          // userId -> user object
  squads: {},         // squadId -> squad object
  challenges: {},     // challengeId -> challenge object
  matches: {},        // matchId -> match object
  agentLog: [],       // Array of agent activity entries (last 50)
  arenaEvents: [],    // Community arena challenges
  bossChallenge: null // Active boss challenge
};

export function getState() {
  return state;
}

export function getUser(userId) {
  return state.users[userId];
}

export function getAllUsers() {
  return Object.values(state.users);
}

export function updateUser(userId, updates) {
  if (state.users[userId]) {
    state.users[userId] = { ...state.users[userId], ...updates };
  }
  return state.users[userId];
}

export function addUser(user) {
  state.users[user.id] = user;
  return user;
}

export function getSquad(squadId) {
  return state.squads[squadId];
}

export function addSquad(squad) {
  state.squads[squad.id] = squad;
  return squad;
}

export function updateSquad(squadId, updates) {
  if (state.squads[squadId]) {
    state.squads[squadId] = { ...state.squads[squadId], ...updates };
  }
  return state.squads[squadId];
}

export function addChallenge(challenge) {
  state.challenges[challenge.id] = challenge;
  return challenge;
}

export function getChallenge(challengeId) {
  return state.challenges[challengeId];
}

export function getChallengesForUser(userId) {
  return Object.values(state.challenges).filter(
    c => c.fromUserId === userId || c.toUserId === userId
  );
}

export function addMatch(match) {
  state.matches[match.id] = match;
  return match;
}

export function getMatchesForUser(userId) {
  return Object.values(state.matches).filter(
    m => m.user1Id === userId || m.user2Id === userId
  );
}

export function logAgentActivity(entry) {
  state.agentLog.unshift({
    ...entry,
    timestamp: new Date().toISOString()
  });
  // Keep last 50 entries
  if (state.agentLog.length > 50) {
    state.agentLog = state.agentLog.slice(0, 50);
  }
  return entry;
}

export function getAgentLog(count = 5) {
  return state.agentLog.slice(0, count);
}

export function setBossChallenge(challenge) {
  state.bossChallenge = challenge;
}

export function getBossChallenge() {
  return state.bossChallenge;
}

export function addArenaEvent(event) {
  state.arenaEvents.unshift(event);
  if (state.arenaEvents.length > 20) {
    state.arenaEvents = state.arenaEvents.slice(0, 20);
  }
}

export function getArenaEvents() {
  return state.arenaEvents;
}

export default state;
