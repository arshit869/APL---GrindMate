import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import ScoreRing from '../components/ScoreRing';
import StreakFlame from '../components/StreakFlame';
import { cricketify } from '../lib/cricketLanguage';
import { TIERS } from '../lib/constants';
import { 
  Dumbbell, Trophy, Target, TrendingUp, Users, 
  Flame, ArrowRight, Zap, Calendar, Clock
} from 'lucide-react';

export default function Dashboard() {
  const { user, updateUser } = useUser();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleScoreUpdate = (data) => {
      if (data.userId === user?.id) {
        updateUser({ fitScore: data.score, tier: data.tier });
      }
    };

    const handleCheckin = (data) => {
      if (data.userId === user?.id) {
        updateUser({ 
          streak: data.streak, 
          todayProgress: data.todayProgress 
        });
      }
    };

    socket.on('score:updated', handleScoreUpdate);
    socket.on('checkin:validated', handleCheckin);

    return () => {
      socket.off('score:updated', handleScoreUpdate);
      socket.off('checkin:validated', handleCheckin);
    };
  }, [socket, user?.id]);

  const remaining = Math.max(0, (user?.goals?.daily || 100) - (user?.todayProgress || 0));
  const progressPercent = Math.min(100, ((user?.todayProgress || 0) / (user?.goals?.daily || 100)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-container pt-20 px-4 md:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="heading-lg">
            Welcome back, <span className="gradient-text">{user?.name || 'Grinder'}</span>
          </h1>
          <p className="text-white/40 mt-1">{cricketify.streak(user?.streak || 0)}</p>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mr-0 lg:mr-[350px]">
          
          {/* Fit Score Ring - Hero */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-card-static flex flex-col md:flex-row items-center gap-8"
          >
            <ScoreRing 
              score={user?.fitScore || 0} 
              size={220} 
              strokeWidth={14} 
              tier={user?.tier}
              label="FIT SCORE"
            />
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="heading-md gradient-text mb-1">YOUR FIT SCORE</h2>
                <p className="text-white/40 text-sm">
                  {user?.fitScore >= 300 
                    ? `Dating visibility: ${Math.round(Math.min(3, (user?.fitScore || 0) / 300) * 100)}%`
                    : `Need ${300 - (user?.fitScore || 0)} more runs to unlock dating`
                  }
                </p>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-white/40 uppercase">Streak</span>
                  <div className="font-mono text-xl font-bold text-grind-pink">{user?.streak || 0}d</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-white/40 uppercase">Coins</span>
                  <div className="font-mono text-xl font-bold text-gold">💰 {user?.coins || 0}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-white/40 uppercase">Tier</span>
                  <div className={`tier-badge tier-${(user?.tier || 'Bronze').toLowerCase()} mt-1`}>
                    {user?.tier || 'Bronze'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-white/40 uppercase">Badges</span>
                  <div className="font-mono text-xl font-bold text-gold">{user?.badges?.length || 0}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Streak + Today */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card-static flex flex-col items-center justify-center gap-4"
          >
            <StreakFlame streak={user?.streak || 0} size="xl" />
            <div className="text-center">
              <h3 className="font-heading text-lg tracking-wider text-white/80">STREAK</h3>
              <p className="text-xs text-white/40 mt-1">
                {cricketify.streak(user?.streak || 0)}
              </p>
            </div>
          </motion.div>

          {/* Today's Goal Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card-static"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-neon-teal" />
                <h3 className="font-heading text-lg tracking-wider">TODAY'S TARGET</h3>
              </div>
              <span className="font-mono text-sm text-white/40">
                {user?.todayProgress || 0} / {user?.goals?.daily || 100} runs
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-full rounded-full"
                style={{
                  background: progressPercent >= 100 
                    ? 'linear-gradient(90deg, #00E5B4, #00B4D8)' 
                    : 'linear-gradient(90deg, #FF3366, #FF6B9D)'
                }}
              />
            </div>

            <p className="text-sm text-white/50">
              🏏 {remaining > 0 ? cricketify.goal(remaining) : cricketify.goal(0)}
            </p>

            <button 
              onClick={() => navigate('/checkin')}
              className="mt-4 btn-teal flex items-center gap-2"
            >
              <Dumbbell className="w-4 h-4" /> Check In Now <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card-static space-y-3"
          >
            <h3 className="font-heading text-lg tracking-wider mb-3">QUICK ACTIONS</h3>
            {[
              { label: 'Squad War Room', icon: Users, path: '/squad', color: 'text-grind-pink' },
              { label: 'GrindMatch', icon: Flame, path: '/grindmatch', color: 'text-beast-purple' },
              { label: 'Community Arena', icon: Trophy, path: '/arena', color: 'text-gold' },
              { label: 'League Standings', icon: TrendingUp, path: '/league', color: 'text-neon-teal' },
            ].map(({ label, icon: Icon, path, color }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 
                           hover:bg-white/[0.06] hover:border-white/10 transition-all group"
              >
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm text-white/60 group-hover:text-white/80">{label}</span>
                <ArrowRight className="w-3 h-3 text-white/20 ml-auto group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </motion.div>

          {/* Squad Activity Feed */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 glass-card-static"
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-grind-pink" />
              <h3 className="font-heading text-lg tracking-wider">SQUAD FEED</h3>
            </div>
            <div className="space-y-3">
              {[
                { text: 'BeastModeRaj checked in — Run, 45 min, High', time: '12m ago', icon: '✅' },
                { text: 'LazyKaran99 missed another day. Duck count: 3 🦆', time: '2h ago', icon: '💀' },
                { text: 'Squad challenge: 50 burpees before sunset', time: '4h ago', icon: '⚡' },
                { text: 'Arshit_Grind earned "Consistency King" badge', time: '6h ago', icon: '🏆' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-white/70">{item.text}</p>
                    <span className="text-[10px] text-white/30 font-mono">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
