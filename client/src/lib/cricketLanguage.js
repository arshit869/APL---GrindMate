// Cricket Language Layer — makes everything feel like a live match

export const cricketify = {
  points: (n) => `${n} runs`,
  
  goal: (remaining) =>
    remaining > 0
      ? `You need ${remaining} runs to win today`
      : `Match won! Target chased down 🏏`,
  
  squadDelta: (delta) =>
    delta > 0
      ? `Your squad is leading by ${delta} runs`
      : `Your squad is ${Math.abs(delta)} runs behind. Don't drop the chase.`,
  
  streak: (days) => {
    if (days >= 30) return `${days}-DAY DOUBLE TON — Legend status 🏆`;
    if (days >= 14) return `${days}-DAY CENTURY — Beast form unlocked 🔥`;
    if (days >= 7) return `${days}-DAY INNINGS — Test match mode 🏏`;
    if (days >= 3) return `${days}-day partnership going strong`;
    if (days === 1) return `Opening innings — keep batting`;
    return `No active innings`;
  },
  
  checkin: (runs) => `+${runs} RUNS — Beast mode activated 🏏`,
  
  forfeit: `3 ducks in a row = OUT. Forfeit incoming. 🦆🦆🦆`,
  
  challenge: `MATCH WON — Bonus runs added to your innings! 🏆`,
  
  scoreUp: (delta, total) => `+${delta} runs scored (total: ${total})`,
  
  scoreDown: (delta, total) => `${delta} runs lost — score decay (total: ${total})`,
  
  matchUnlock: (name) => `New partnership with ${name} — innings begins! 💜`,
  
  bossChallenge: `BOSS INNINGS DROPPED — This is the final over. No pressure. 🔥`,
  
  tierUp: (tier) => `PROMOTED to ${tier}! New pavilion unlocked 🏟️`,
  
  tierDown: (tier) => `Relegated to ${tier}. Time to rebuild your innings.`,
  
  noActivity: `Your score drops in 18h — don't ghost the gym 🏏`,
  
  // Format score with tier context
  formatScore: (score) => {
    if (score >= 950) return { text: `${score}`, suffix: 'Legend runs' };
    if (score >= 800) return { text: `${score}`, suffix: 'Diamond runs' };
    if (score >= 600) return { text: `${score}`, suffix: 'Platinum runs' };
    return { text: `${score}`, suffix: 'runs' };
  }
};
