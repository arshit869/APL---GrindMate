import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { Swords, Trophy, Clock, Users, Flame, Zap } from 'lucide-react';

export default function Arena() {
  const { socket } = useSocket();
  const [events, setEvents] = useState([
    { id: 'ae1', title: '10K Steps City Challenge', description: 'Walk 10,000 steps every day for 7 days.', participants: 247, deadline: new Date(Date.now() + 5 * 86400000).toISOString(), runs: 500, difficulty: 'medium', active: true },
    { id: 'ae2', title: 'Plank Marathon', description: 'Accumulate 30 minutes of plank time this week.', participants: 132, deadline: new Date(Date.now() + 3 * 86400000).toISOString(), runs: 300, difficulty: 'high', active: true },
  ]);
  const [boss, setBoss] = useState({
    title: '🔥 BOSS CHALLENGE: Iron Man Weekend', description: 'Complete 5 workouts in 48 hours. Any type. Minimum 30 minutes each.',
    runs: 500, deadline: new Date(Date.now() + 2 * 86400000).toISOString(), participants: 89, active: true
  });

  useEffect(() => {
    if (!socket) return;
    const onBoss = (data) => setBoss(data);
    socket.on('boss:dropped', onBoss);
    return () => socket.off('boss:dropped', onBoss);
  }, [socket]);

  const getTimeLeft = (deadline) => {
    const diff = new Date(deadline) - Date.now();
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    return `${days}d ${hours}h left`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container pt-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto mr-0 lg:mr-[350px]">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <div className="flex items-center gap-3"><Swords className="w-8 h-8 text-gold" /><h1 className="heading-lg">COMMUNITY <span className="gradient-text-gold">ARENA</span></h1></div>
          <p className="text-white/40 mt-1">City-wide challenges. Prove your grind to everyone. 🏏</p>
        </motion.div>

        {/* Boss Challenge Banner */}
        {boss && boss.active && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-6 rounded-2xl border-2 border-grind-pink/30 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(255,51,102,0.15), rgba(123,47,190,0.15))' }}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-grind-pink/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-6 h-6 text-grind-pink animate-pulse" />
                <span className="text-xs font-mono text-grind-pink uppercase tracking-widest">Boss Challenge Active</span>
              </div>
              <h2 className="heading-md text-white mb-2">{boss.title}</h2>
              <p className="text-white/60 mb-4">{boss.description}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-grind-pink" /><span className="font-mono text-sm text-grind-pink">{getTimeLeft(boss.deadline)}</span></div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-neon-teal" /><span className="font-mono text-sm text-neon-teal">{boss.participants} warriors</span></div>
                <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-gold" /><span className="font-mono text-sm text-gold">+{boss.runs} runs</span></div>
              </div>
              <button className="mt-4 btn-primary">⚔️ Accept Boss Challenge</button>
            </div>
          </motion.div>
        )}

        {/* Community Challenges */}
        <h3 className="font-heading text-lg tracking-wider mb-4">WEEKLY CHALLENGES</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, i) => (
            <motion.div key={event.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className="glass-card">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-mono ${event.difficulty === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {event.difficulty}
                </span>
                <span className="font-mono text-xs text-white/40">{getTimeLeft(event.deadline)}</span>
              </div>
              <h4 className="font-heading text-xl mb-2">{event.title}</h4>
              <p className="text-sm text-white/50 mb-4">{event.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs text-neon-teal"><Users className="w-3 h-3" />{event.participants}</span>
                  <span className="flex items-center gap-1 text-xs text-gold"><Trophy className="w-3 h-3" />+{event.runs} runs</span>
                </div>
                <button className="btn-secondary text-xs px-3 py-1.5">Join</button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Beast of the Week */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-8 glass-card-static text-center">
          <h3 className="font-heading text-lg tracking-wider mb-3">🏆 BEAST OF THE WEEK</h3>
          <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center text-3xl mx-auto mb-3">👑</div>
          <p className="font-heading text-xl text-gold">Arshit_Grind</p>
          <p className="text-sm text-white/40">847 runs · 14-day streak · Diamond tier</p>
          <p className="text-xs text-white/30 mt-2">Highest scorer this week in all of Mumbai</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
