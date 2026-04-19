import React from 'react';
import { motion } from 'framer-motion';
import { TIERS } from '../lib/constants';
import { Trophy, TrendingUp, TrendingDown, Crown, ChevronUp, ChevronDown } from 'lucide-react';

const LEAGUE_DATA = [
  { id: 'u1', name: 'Arshit_Grind', fitScore: 847, tier: 'Diamond', streak: 14, trend: 'up', delta: '+23' },
  { id: 'u2', name: 'BeastModeRaj', fitScore: 792, tier: 'Platinum', streak: 9, trend: 'up', delta: '+15' },
  { id: 'u3', name: 'Priya_Lifts', fitScore: 651, tier: 'Gold', streak: 21, trend: 'up', delta: '+8' },
  { id: 'u5', name: 'FitnessFury42', fitScore: 580, tier: 'Gold', streak: 5, trend: 'down', delta: '-12' },
  { id: 'u6', name: 'IronWill_Sam', fitScore: 445, tier: 'Gold', streak: 3, trend: 'up', delta: '+5' },
  { id: 'u7', name: 'RunnerRiya', fitScore: 380, tier: 'Silver', streak: 7, trend: 'up', delta: '+18' },
  { id: 'u8', name: 'ChillBro_Dev', fitScore: 290, tier: 'Silver', streak: 1, trend: 'down', delta: '-8' },
  { id: 'u4', name: 'LazyKaran99', fitScore: 184, tier: 'Bronze', streak: 0, trend: 'down', delta: '-5' },
];

export default function League() {
  const tierOrder = ['Legend', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container pt-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto mr-0 lg:mr-[350px]">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <div className="flex items-center gap-3"><Trophy className="w-8 h-8 text-gold" /><h1 className="heading-lg">LEAGUE <span className="gradient-text-gold">STANDINGS</span></h1></div>
          <p className="text-white/40 mt-1">Monthly reset · Promotion and relegation drama · 🏏</p>
        </motion.div>

        {/* Tier legend */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-wrap gap-2 mb-6">
          {tierOrder.map(tier => {
            const tc = TIERS[tier];
            return (
              <div key={tier} className={`tier-badge tier-${tier.toLowerCase()}`}>
                <span className="w-2 h-2 rounded-full" style={{ background: tc.color }} /> {tier} ({tc.min}–{tc.max})
              </div>
            );
          })}
        </motion.div>

        {/* Standings table */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card-static">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-white/30 uppercase tracking-widest border-b border-white/5">
                  <th className="py-3 px-2 text-left">#</th>
                  <th className="py-3 px-2 text-left">Player</th>
                  <th className="py-3 px-2 text-center">Tier</th>
                  <th className="py-3 px-2 text-center">Score</th>
                  <th className="py-3 px-2 text-center">Streak</th>
                  <th className="py-3 px-2 text-center">Trend</th>
                </tr>
              </thead>
              <tbody>
                {LEAGUE_DATA.map((player, idx) => {
                  const tc = TIERS[player.tier] || TIERS.Bronze;
                  const isPromo = idx < 3;
                  const isRelegation = idx >= LEAGUE_DATA.length - 2;
                  return (
                    <motion.tr key={player.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors
                        ${player.name === 'Arshit_Grind' ? 'bg-grind-pink/5' : ''}`}>
                      <td className="py-3 px-2">
                        <span className="font-heading text-lg text-white/30">
                          {idx === 0 ? '👑' : idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{player.name}</span>
                          {player.name === 'Arshit_Grind' && <span className="text-[9px] px-1.5 py-0.5 bg-grind-pink/20 text-grind-pink rounded">YOU</span>}
                          {isPromo && <ChevronUp className="w-3 h-3 text-neon-teal" />}
                          {isRelegation && <ChevronDown className="w-3 h-3 text-red-400" />}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`tier-badge tier-${player.tier.toLowerCase()} text-[9px]`}>{player.tier}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="font-mono text-lg font-bold" style={{ color: tc.color }}>{player.fitScore}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="font-mono text-sm text-grind-pink">🔥 {player.streak}d</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`font-mono text-xs ${player.trend === 'up' ? 'text-neon-teal' : 'text-red-400'}`}>
                          {player.trend === 'up' ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />} {player.delta}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-[10px] text-white/30">
            <span className="flex items-center gap-1"><ChevronUp className="w-3 h-3 text-neon-teal" /> Promotion zone</span>
            <span className="flex items-center gap-1"><ChevronDown className="w-3 h-3 text-red-400" /> Relegation zone</span>
            <span className="ml-auto font-mono">Season resets in 18 days</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
