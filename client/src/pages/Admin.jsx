import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { Settings, Zap, Play, Terminal, Users, Flame, Heart, Trophy, AlertTriangle, Bot } from 'lucide-react';

const EVENTS = [
  { event: 'checkin', label: '✅ Fire Check-in', desc: 'Simulate workout check-in + full agent pipeline', icon: Zap, color: 'text-neon-teal', bg: 'bg-neon-teal/10 border-neon-teal/20' },
  { event: 'roast', label: '🔥 Generate Roast', desc: 'Roast Agent fires (Claude API if available)', icon: Flame, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { event: 'challenge', label: '⚡ New Challenge', desc: 'Challenge Agent generates squad micro-challenge', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { event: 'forfeit', label: '💀 Assign Forfeit', desc: 'Forfeit LazyKaran99 for missing 3 days', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { event: 'match_unlock', label: '💜 Unlock Match', desc: 'Unlock Arshit ↔ Priya match + AI opener', icon: Heart, color: 'text-beast-purple', bg: 'bg-beast-purple/10 border-beast-purple/20' },
  { event: 'boss_challenge', label: '🔥 Drop Boss Challenge', desc: 'Community-wide Boss Challenge announcement', icon: Trophy, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
  { event: 'score_update', label: '📊 Recalculate Score', desc: 'Fit Score Agent recalculates for user', icon: Bot, color: 'text-neon-teal', bg: 'bg-neon-teal/10 border-neon-teal/20' },
  { event: 'goal_set', label: '🎯 Set New Goal', desc: 'Goal Agent sets personalized target', icon: Bot, color: 'text-neon-teal', bg: 'bg-neon-teal/10 border-neon-teal/20' },
];

const USERS = [
  { id: 'u1', name: 'Arshit_Grind', tier: 'Diamond' },
  { id: 'u2', name: 'BeastModeRaj', tier: 'Platinum' },
  { id: 'u3', name: 'Priya_Lifts', tier: 'Gold' },
  { id: 'u4', name: 'LazyKaran99', tier: 'Bronze' },
];

export default function Admin() {
  const { connected } = useSocket();
  const [selectedUser, setSelectedUser] = useState('u1');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState({});
  const [adminState, setAdminState] = useState(null);

  useEffect(() => { fetchState(); }, []);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/admin/state');
      const data = await res.json();
      setAdminState(data);
    } catch {}
  };

  const trigger = async (event) => {
    setLoading(p => ({ ...p, [event]: true }));
    const timestamp = new Date().toLocaleTimeString();
    try {
      const body = { event, userId: selectedUser, squadId: 's1' };
      if (event === 'match_unlock') body.data = { matchUserId: 'u3' };
      if (event === 'forfeit') body.userId = 'u4';
      
      const res = await fetch('/api/admin/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setLogs(p => [{ event, timestamp, success: true, data: JSON.stringify(data).slice(0, 200) }, ...p].slice(0, 20));
      fetchState();
    } catch (err) {
      setLogs(p => [{ event, timestamp, success: false, data: err.message }, ...p].slice(0, 20));
    }
    setLoading(p => ({ ...p, [event]: false }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container pt-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-grind-pink animate-spin-slow" />
            <h1 className="heading-lg">ADMIN <span className="gradient-text">PANEL</span></h1>
            <span className={`text-xs px-2 py-1 rounded-full font-mono ${connected ? 'bg-neon-teal/10 text-neon-teal border border-neon-teal/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {connected ? '🟢 Socket Connected' : '🔴 Disconnected'}
            </span>
          </div>
          <p className="text-white/40 mt-1">Demo control panel — trigger any event for live demo with judges 🏏</p>
        </motion.div>

        {/* Target user selector */}
        <div className="glass-card-static mb-6">
          <label className="text-sm text-white/50 mb-2 block">Target User</label>
          <div className="flex gap-2 flex-wrap">
            {USERS.map(u => (
              <button key={u.id} onClick={() => setSelectedUser(u.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedUser === u.id ? 'bg-grind-pink/20 text-grind-pink border border-grind-pink/30' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                {u.name} <span className="text-[9px] opacity-60">({u.tier})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event triggers */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg tracking-wider mb-2">EVENT TRIGGERS</h3>
            {EVENTS.map(({ event, label, desc, icon: Icon, color, bg }) => (
              <motion.button key={event} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => trigger(event)} disabled={loading[event]}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-white/[0.04] ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-[10px] text-white/30">{desc}</p>
                </div>
                {loading[event] ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4 text-white/30" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Logs + State */}
          <div className="space-y-6">
            <div className="glass-card-static">
              <div className="flex items-center gap-2 mb-3"><Terminal className="w-4 h-4 text-neon-teal" /><h3 className="font-heading text-lg tracking-wider">EVENT LOG</h3></div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className={`p-2 rounded-lg text-xs font-mono ${log.success ? 'bg-neon-teal/5 border border-neon-teal/10' : 'bg-red-500/5 border border-red-500/10'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={log.success ? 'text-neon-teal' : 'text-red-400'}>{log.success ? '✓' : '✗'} {log.event}</span>
                      <span className="text-white/30">{log.timestamp}</span>
                    </div>
                    <p className="text-white/40 text-[10px] break-all">{log.data}</p>
                  </div>
                ))}
                {logs.length === 0 && <p className="text-white/20 text-sm text-center py-4">No events fired yet</p>}
              </div>
            </div>

            {adminState && (
              <div className="glass-card-static">
                <h3 className="font-heading text-lg tracking-wider mb-3">LIVE STATE</h3>
                <div className="space-y-2">
                  {adminState.users?.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                      <span className="text-sm">{u.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-neon-teal">{u.fitScore} pts</span>
                        <span className="font-mono text-xs text-gold">💰{u.coins}</span>
                        <span className="font-mono text-xs text-grind-pink">🔥{u.streak}d</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
