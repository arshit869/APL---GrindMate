import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgents } from '../context/AgentContext';
import { AGENT_COLORS } from '../lib/constants';
import { X, Bot, ChevronRight } from 'lucide-react';

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function AgentPanel() {
  const { activities, panelOpen, togglePanel } = useAgents();

  return (
    <>
      {/* Toggle button when closed */}
      {!panelOpen && (
        <motion.button
          onClick={togglePanel}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-grind-pink/90 backdrop-blur-sm px-2 py-4 rounded-l-xl
                     shadow-lg shadow-grind-pink/30 hover:bg-grind-pink transition-all"
          initial={{ x: 10 }}
          animate={{ x: 0 }}
          whileHover={{ x: -4 }}
        >
          <Bot className="w-5 h-5 text-white mb-1" />
          <ChevronRight className="w-4 h-4 text-white/70 rotate-180" />
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-neon-teal rounded-full animate-pulse" />
        </motion.button>
      )}

      {/* Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-16 bottom-0 w-[340px] z-40 
                       bg-void/95 backdrop-blur-xl border-l border-white/10
                       flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-grind-pink" />
                <h3 className="font-heading text-lg tracking-wider">AGENT ACTIVITY</h3>
                <div className="w-2 h-2 bg-neon-teal rounded-full animate-pulse" />
              </div>
              <button onClick={togglePanel} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>

            {/* Pipeline visualization */}
            <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {['Goal', 'Check-in', 'Adaptive', 'Challenge', 'Roast', 'Reward', 'FitScore'].map((name, i) => (
                  <div key={name} className="flex items-center">
                    <div className={`px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap
                      ${i === 3 || i === 4 ? 'bg-grind-pink/20 text-grind-pink border border-grind-pink/30' : 'bg-white/5 text-white/50 border border-white/10'}`}
                    >
                      {i + 1}
                    </div>
                    {i < 6 && <span className="text-white/20 text-[8px] mx-0.5">→</span>}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/30 mt-1">Agents 4 & 5 use Claude API • Others mock</p>
            </div>

            {/* Activity feed */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              <AnimatePresence initial={false}>
                {activities.slice(0, 15).map((activity, index) => {
                  const agentConfig = AGENT_COLORS[activity.agentName] || { class: 'agent-teal', color: '#00E5B4' };
                  
                  return (
                    <motion.div
                      key={`${activity.timestamp}-${index}`}
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className={`p-3 rounded-xl bg-white/[0.03] border border-white/5 ${agentConfig.class}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider"
                              style={{ color: agentConfig.color }}>
                          🤖 {activity.agentName}
                        </span>
                        <span className="text-[9px] text-white/30 font-mono">
                          {timeAgo(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {activity.message}
                      </p>
                      {activity.usedClaude && (
                        <span className="inline-block mt-1 text-[9px] text-grind-pink/60 font-mono">
                          ⚡ Claude API
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {activities.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-xs text-white/30">Agents warming up...</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02]">
              <p className="text-[10px] text-white/20 text-center font-mono">
                7 Agents • Google ADK Sequential Pipeline
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
