import React from 'react';
import { motion } from 'framer-motion';
import { TIERS, BADGE_INFO } from '../lib/constants';
import { Flame, Trophy, Dumbbell, Target } from 'lucide-react';

export default function FitCard({ user, onAction, actionLabel = 'Send Challenge', showPhoto = false, matchOpener }) {
  const tierConfig = TIERS[user.tier] || TIERS.Bronze;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card relative overflow-hidden group cursor-pointer"
    >
      {/* Tier gradient accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${tierConfig.color}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading text-xl tracking-wider text-white">{user.name}</h3>
          <span className={`tier-badge tier-${user.tier?.toLowerCase()}`}>
            {user.tier}
          </span>
        </div>
        
        {/* Avatar / Score circle */}
        <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
             style={{ 
               background: showPhoto 
                 ? `linear-gradient(135deg, ${tierConfig.color}40, transparent)` 
                 : `linear-gradient(135deg, ${tierConfig.color}20, ${tierConfig.color}05)`,
               border: `2px solid ${tierConfig.color}40`
             }}>
          {showPhoto ? (
            <span className="text-2xl">
              {user.name === 'Priya_Lifts' ? '👩' : user.name === 'BeastModeRaj' ? '💪' : user.name === 'LazyKaran99' ? '😴' : '🔥'}
            </span>
          ) : (
            <span className="font-mono text-lg font-bold" style={{ color: tierConfig.color }}>
              {user.fitScore}
            </span>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-white/[0.03]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-3 h-3 text-neon-teal" />
          </div>
          <span className="font-mono text-lg font-bold text-neon-teal">{user.fitScore}</span>
          <p className="text-[10px] text-white/40 uppercase">Fit Score</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-white/[0.03]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-3 h-3 text-grind-pink" />
          </div>
          <span className="font-mono text-lg font-bold text-grind-pink">{user.streak || 0}</span>
          <p className="text-[10px] text-white/40 uppercase">Streak</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-white/[0.03]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Dumbbell className="w-3 h-3 text-gold" />
          </div>
          <span className="font-mono text-xs font-bold text-gold">{user.favoriteWorkout || 'Gym'}</span>
          <p className="text-[10px] text-white/40 uppercase">Fav</p>
        </div>
      </div>

      {/* Goal type */}
      <div className="mb-4">
        <span className="text-xs text-white/40">Goal: </span>
        <span className="text-xs text-white/70 font-medium">{user.goalType || 'General Fitness'}</span>
      </div>

      {/* Badges */}
      {user.badges && user.badges.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {user.badges.slice(0, 3).map(badge => (
            <span key={badge} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
              {BADGE_INFO[badge]?.icon || '🏆'} {badge}
            </span>
          ))}
        </div>
      )}

      {/* Match opener (revealed state) */}
      {matchOpener && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 rounded-xl bg-beast-purple/10 border border-beast-purple/20"
        >
          <p className="text-xs text-white/50 mb-1">💬 AI Conversation Opener:</p>
          <p className="text-sm text-white/80 italic">{matchOpener}</p>
        </motion.div>
      )}

      {/* Action button */}
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction(user)}
          className="w-full btn-purple text-sm"
        >
          {actionLabel}
        </motion.button>
      )}

      {/* Funny title */}
      {user.funnyTitle && (
        <div className="absolute top-2 right-2 text-[9px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">
          {user.funnyTitle}
        </div>
      )}
    </motion.div>
  );
}
