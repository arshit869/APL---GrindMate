import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { TIERS, BADGE_INFO, FUNNY_TITLES } from '../lib/constants';
import { cricketify } from '../lib/cricketLanguage';
import ScoreRing from '../components/ScoreRing';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { User, Trophy, Flame, TrendingUp, Award, Calendar } from 'lucide-react';

export default function Profile() {
  const { user } = useUser();
  const scoreHistory = user?.scoreHistory || Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    score: 600 + Math.floor(i * 8.5 + Math.random() * 15)
  }));

  const badges = user?.badges || ['Beast Mode', 'Consistency King', 'Challenge Crusher'];
  const allBadgeKeys = Object.keys(BADGE_INFO);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container pt-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto mr-0 lg:mr-[350px]">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <h1 className="heading-lg"><span className="gradient-text">{user?.name || 'PROFILE'}</span></h1>
          {user?.funnyTitle && <p className="text-white/40 mt-1">{FUNNY_TITLES[user.funnyTitle] || user.funnyTitle}</p>}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fit Score + Stats */}
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card-static flex flex-col items-center">
            <ScoreRing score={user?.fitScore || 0} size={180} strokeWidth={12} tier={user?.tier} label="FIT SCORE" />
            <div className="grid grid-cols-2 gap-3 mt-6 w-full">
              <div className="p-3 rounded-xl bg-white/[0.03] text-center">
                <Flame className="w-4 h-4 text-grind-pink mx-auto mb-1" />
                <span className="font-mono text-lg font-bold text-grind-pink">{user?.streak || 0}</span>
                <p className="text-[9px] text-white/40">STREAK</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] text-center">
                <Trophy className="w-4 h-4 text-gold mx-auto mb-1" />
                <span className="font-mono text-lg font-bold text-gold">{badges.length}</span>
                <p className="text-[9px] text-white/40">BADGES</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] text-center">
                <Award className="w-4 h-4 text-neon-teal mx-auto mb-1" />
                <span className="font-mono text-lg font-bold text-neon-teal">{user?.coins || 0}</span>
                <p className="text-[9px] text-white/40">COINS</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] text-center">
                <Calendar className="w-4 h-4 text-beast-purple mx-auto mb-1" />
                <span className={`tier-badge tier-${(user?.tier || 'Bronze').toLowerCase()} text-[9px]`}>{user?.tier}</span>
                <p className="text-[9px] text-white/40 mt-1">TIER</p>
              </div>
            </div>
          </motion.div>

          {/* Score History Graph */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-card-static">
            <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-neon-teal" /><h3 className="font-heading text-lg tracking-wider">SCORE HISTORY</h3></div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreHistory}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF3366" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF3366" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                  <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)' }} itemStyle={{ color: '#FF3366' }} />
                  <Area type="monotone" dataKey="score" stroke="#FF3366" strokeWidth={2} fill="url(#scoreGradient)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Badge Wall */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="lg:col-span-3 glass-card-static">
            <div className="flex items-center gap-2 mb-4"><Trophy className="w-5 h-5 text-gold" /><h3 className="font-heading text-lg tracking-wider">BADGE WALL</h3></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {allBadgeKeys.map(badge => {
                const info = BADGE_INFO[badge];
                const earned = badges.includes(badge);
                return (
                  <motion.div key={badge} whileHover={earned ? { scale: 1.05, y: -4 } : {}}
                    className={`p-4 rounded-xl text-center border transition-all ${earned ? 'bg-gold/10 border-gold/20' : 'bg-white/[0.02] border-white/5 opacity-30'}`}>
                    <span className="text-3xl block mb-2">{info?.icon || '🏆'}</span>
                    <p className="text-xs font-medium text-white/80">{badge}</p>
                    <p className="text-[9px] text-white/40 mt-1">{info?.description}</p>
                    {earned && <span className="text-[8px] text-neon-teal mt-1 block">✓ Earned</span>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
