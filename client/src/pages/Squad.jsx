import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import { cricketify } from '../lib/cricketLanguage';
import { TIERS } from '../lib/constants';
import { Users, Zap, Flame, Trophy, MessageCircle, AlertTriangle, Crown } from 'lucide-react';

export default function Squad() {
  const { user } = useUser();
  const { socket } = useSocket();
  const [squad, setSquad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roasts, setRoasts] = useState([]);
  const [genRoast, setGenRoast] = useState(false);
  const [genChallenge, setGenChallenge] = useState(false);

  useEffect(() => { fetchSquad(); }, []);

  useEffect(() => {
    if (!socket) return;
    const onRoast = (d) => { if (d.squadId === (user?.squadId || 's1')) setRoasts(p => [d.roast, ...p].slice(0, 15)); };
    const onChallenge = (d) => { if (d.squadId === (user?.squadId || 's1')) setSquad(p => p ? { ...p, dailyChallenge: d.challenge } : p); };
    socket.on('roast:new', onRoast);
    socket.on('challenge:new', onChallenge);
    return () => { socket.off('roast:new', onRoast); socket.off('challenge:new', onChallenge); };
  }, [socket]);

  const fetchSquad = async () => {
    try {
      const res = await fetch(`/api/squad/${user?.squadId || 's1'}`);
      const data = await res.json();
      setSquad(data.squad);
      setRoasts(data.squad?.roasts || []);
    } catch {
      setSquad({
        name: 'Iron Legion', members: [
          { id: 'u1', name: 'Arshit_Grind', fitScore: 847, streak: 14, tier: 'Diamond', funnyTitle: 'Oracle' },
          { id: 'u2', name: 'BeastModeRaj', fitScore: 792, streak: 9, tier: 'Platinum', funnyTitle: 'Try-Hard' },
          { id: 'u4', name: 'LazyKaran99', fitScore: 184, streak: 0, tier: 'Bronze', funnyTitle: 'Ghost Mode' },
        ],
        dailyChallenge: { challenge: '50 burpees before sunset', difficulty: 'high', runs: 60 },
        forfeits: [{ userId: 'u4', type: 'public_apology', reason: 'Missed 3 days' }],
      });
      setRoasts([
        { text: "LazyKaran99 missed day 3 again. Even the umpire runs more.", timestamp: new Date(Date.now() - 3600000).toISOString() },
        { text: "Arshit_Grind is on a 14-day streak. The rest of you are in gully cricket.", timestamp: new Date(Date.now() - 7200000).toISOString() },
      ]);
    }
    setLoading(false);
  };

  const generateRoast = async () => {
    setGenRoast(true);
    try {
      const res = await fetch(`/api/squad/${user?.squadId || 's1'}/roast`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ context: 'Daily banter' }) });
      const d = await res.json();
      if (d.roast) setRoasts(p => [d.roast, ...p].slice(0, 15));
    } catch {}
    setGenRoast(false);
  };

  const generateChallenge = async () => {
    setGenChallenge(true);
    try {
      const res = await fetch(`/api/squad/${user?.squadId || 's1'}/challenge`, { method: 'POST' });
      const d = await res.json();
      if (d.challenge) setSquad(p => p ? { ...p, dailyChallenge: d.challenge } : p);
    } catch {}
    setGenChallenge(false);
  };

  if (loading) return <div className="page-container pt-20 flex items-center justify-center"><div className="w-8 h-8 border-2 border-grind-pink/30 border-t-grind-pink rounded-full animate-spin" /></div>;

  const members = squad?.members || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container pt-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto mr-0 lg:mr-[350px]">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <div className="flex items-center gap-3"><Users className="w-8 h-8 text-grind-pink" /><h1 className="heading-lg">{squad?.name || 'SQUAD'} <span className="gradient-text">WAR ROOM</span></h1></div>
          <p className="text-white/40 mt-1">Combined: <span className="font-mono text-neon-teal">{members.reduce((s, m) => s + (m.fitScore || 0), 0)}</span> runs</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card-static">
            <div className="flex items-center gap-2 mb-4"><Crown className="w-5 h-5 text-gold" /><h3 className="font-heading text-lg tracking-wider">SQUAD LEADERBOARD</h3></div>
            <div className="space-y-3">
              {members.sort((a, b) => b.fitScore - a.fitScore).map((m, idx) => {
                const tc = TIERS[m.tier] || TIERS.Bronze;
                const isU = m.id === user?.id || m.name === user?.name;
                return (
                  <motion.div key={m.id} layout initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${isU ? 'bg-grind-pink/10 border-grind-pink/20' : 'bg-white/[0.03] border-white/5'}`}>
                    <span className="font-heading text-2xl text-white/30 w-8 text-center">{idx === 0 ? '👑' : `#${idx + 1}`}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{m.name}</span>
                        {isU && <span className="text-[9px] px-1.5 py-0.5 bg-grind-pink/20 text-grind-pink rounded">YOU</span>}
                        <span className={`tier-badge tier-${m.tier.toLowerCase()} text-[9px]`}>{m.tier}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1"><span className="text-[10px] text-white/40">🔥 {m.streak}d</span>{m.funnyTitle && <span className="text-[10px] text-white/30">{m.funnyTitle}</span>}</div>
                    </div>
                    <div className="text-right"><span className="font-mono text-xl font-bold" style={{ color: tc.color }}>{m.fitScore}</span><p className="text-[9px] text-white/30">runs</p></div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Daily Challenge */}
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card-static">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /><h3 className="font-heading text-lg tracking-wider">DAILY CHALLENGE</h3></div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">AI Generated</span>
            </div>
            {squad?.dailyChallenge && (
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-4">
                <p className="text-lg font-medium text-white/90 mb-2">{squad.dailyChallenge.challenge}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-400">{squad.dailyChallenge.difficulty}</span>
                  <span className="font-mono text-sm text-neon-teal">+{squad.dailyChallenge.runs} runs</span>
                </div>
              </div>
            )}
            <button onClick={generateChallenge} disabled={genChallenge} className="w-full btn-secondary text-sm flex items-center justify-center gap-2">
              {genChallenge ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>⚡ Generate New Challenge</>}
            </button>
            {squad?.forfeits?.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-red-400" /><h4 className="text-sm font-medium text-red-400">FORFEITS</h4></div>
                {squad.forfeits.map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 mb-2">
                    <p className="text-sm text-white/70">{cricketify.forfeit}</p>
                    <p className="text-[10px] text-white/30 mt-1">{members.find(m => m.id === f.userId)?.name || 'Unknown'}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Roast Chat */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card-static">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-red-400" /><h3 className="font-heading text-lg tracking-wider">ROAST FEED</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-grind-pink/10 text-grind-pink border border-grind-pink/20 font-mono">Claude API</span></div>
              <button onClick={generateRoast} disabled={genRoast} className="btn-primary text-xs px-4 py-2">
                {genRoast ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>🔥 Generate Roast</>}
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {roasts.map((r, i) => (
                <motion.div key={`${r.timestamp}-${i}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-xl">🤖</span>
                  <div className="flex-1"><p className="text-sm text-white/80">{r.text}</p>
                    <span className="text-[9px] text-white/30 font-mono">Roast Agent · {new Date(r.timestamp).toLocaleTimeString()}</span></div>
                </motion.div>
              ))}
              {roasts.length === 0 && <div className="text-center py-8 text-white/30 text-sm">No roasts yet. Hit that button 🔥</div>}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
