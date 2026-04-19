import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import FitCard from '../components/FitCard';
import { Heart, Send, Unlock, MessageCircle, Sparkles } from 'lucide-react';

export default function GrindMatch() {
  const { user } = useUser();
  const { socket } = useSocket();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [challengeModal, setChallengeModal] = useState(false);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [unlockedMatch, setUnlockedMatch] = useState(null);
  const [typedOpener, setTypedOpener] = useState('');

  useEffect(() => { fetchCards(); }, []);

  useEffect(() => {
    if (!socket) return;
    const onUnlock = (data) => {
      setUnlockedMatch(data);
      // Typewriter effect for opener
      if (data.match?.opener) {
        let i = 0;
        const text = data.match.opener;
        const interval = setInterval(() => {
          setTypedOpener(text.slice(0, i + 1));
          i++;
          if (i >= text.length) clearInterval(interval);
        }, 30);
      }
    };
    socket.on('match:unlocked', onUnlock);
    return () => socket.off('match:unlocked', onUnlock);
  }, [socket]);

  const fetchCards = async () => {
    try {
      const res = await fetch(`/api/grindmatch/cards?userId=${user?.id || 'u1'}`);
      const data = await res.json();
      setCards(data.cards || []);
    } catch {
      setCards([
        { id: 'u2', name: 'BeastModeRaj', fitScore: 792, streak: 9, tier: 'Platinum', goalType: 'Endurance', favoriteWorkout: 'Run', badges: ['Challenge Crusher', 'Comeback Kid'], funnyTitle: 'Try-Hard' },
        { id: 'u3', name: 'Priya_Lifts', fitScore: 651, streak: 21, tier: 'Gold', goalType: 'Flexibility', favoriteWorkout: 'Yoga', badges: ['Social Magnet', 'Comeback Kid', 'Beast Mode'], funnyTitle: 'Sleeping Giant' },
      ]);
    }
    setLoading(false);
  };

  const sendChallenge = async (targetUser) => {
    try {
      const res = await fetch('/api/grindmatch/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId: user?.id || 'u1', toUserId: targetUser.id })
      });
      const data = await res.json();
      if (data.challenge) {
        setPendingChallenges(p => [...p, data.challenge]);
        setChallengeModal(false);
        setSelectedUser(null);
      }
    } catch {
      setPendingChallenges(p => [...p, { id: 'demo', fromUserId: user?.id, toUserId: targetUser.id, challenge: { challenge: 'Both hit 10K steps for 3 days', duration: 3 }, status: 'pending', createdAt: new Date().toISOString() }]);
      setChallengeModal(false);
      setSelectedUser(null);
    }
  };

  const triggerUnlock = async (challengeId) => {
    try {
      await fetch('/api/grindmatch/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      });
    } catch {}
  };

  const scoreLocked = (user?.fitScore || 0) < 300;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container pt-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto mr-0 lg:mr-[350px]">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-beast-purple" />
            <h1 className="heading-lg">GRIND<span className="text-beast-purple">MATCH</span></h1>
          </div>
          <p className="text-white/40 mt-1">Fitness-first dating. No photos until you prove your grind. 🏏</p>
        </motion.div>

        {scoreLocked ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card-static text-center py-12">
            <Unlock className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="heading-md text-white/50 mb-2">DATING LOCKED</h2>
            <p className="text-white/30 mb-4">You need 300+ runs to unlock GrindMatch</p>
            <p className="font-mono text-2xl text-grind-pink">{user?.fitScore || 0} / 300</p>
            <div className="w-64 mx-auto h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-grind-pink rounded-full transition-all" style={{ width: `${Math.min(100, ((user?.fitScore || 0) / 300) * 100)}%` }} />
            </div>
          </motion.div>
        ) : (
          <>
            {/* Match unlock reveal */}
            {unlockedMatch && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-card-static mb-6 border-beast-purple/30 bg-beast-purple/5">
                <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-beast-purple" /><h3 className="font-heading text-lg text-beast-purple">MATCH UNLOCKED!</h3></div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-beast-purple/20 flex items-center justify-center text-2xl border-2 border-beast-purple/40">
                    {unlockedMatch.user1?.name === user?.name ? '🔥' : '👩'}
                  </div>
                  <span className="text-beast-purple text-xl">💜</span>
                  <div className="w-16 h-16 rounded-full bg-beast-purple/20 flex items-center justify-center text-2xl border-2 border-beast-purple/40">
                    {unlockedMatch.user2?.name === user?.name ? '🔥' : '👩'}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-beast-purple/10">
                  <p className="text-xs text-white/40 mb-1"><MessageCircle className="w-3 h-3 inline" /> AI Conversation Starter:</p>
                  <p className="text-white/80 italic">{typedOpener}<span className="animate-pulse">|</span></p>
                </div>
              </motion.div>
            )}

            {/* Pending Challenges */}
            {pendingChallenges.length > 0 && (
              <div className="mb-6">
                <h3 className="font-heading text-lg tracking-wider mb-3">PENDING CHALLENGES</h3>
                <div className="space-y-3">
                  {pendingChallenges.map((ch, i) => (
                    <motion.div key={ch.id || i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      className="glass-card-static flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/80">{ch.challenge?.challenge || 'Shared challenge'}</p>
                        <p className="text-[10px] text-white/30 mt-1">{ch.challenge?.duration || 3} days · {ch.status}</p>
                      </div>
                      <button onClick={() => triggerUnlock(ch.id)} className="btn-purple text-xs px-3 py-1.5">Complete & Unlock</button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Fit Cards Grid */}
            <h3 className="font-heading text-lg tracking-wider mb-4">FIT CARDS — NO PHOTOS, JUST GRIND</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map(card => (
                <FitCard key={card.id} user={card} actionLabel="💜 Send Challenge" onAction={(u) => { setSelectedUser(u); setChallengeModal(true); }} />
              ))}
            </div>
            {cards.length === 0 && !loading && (
              <div className="text-center py-12 text-white/30">No compatible Fit Cards found. Keep grinding! 🏏</div>
            )}
          </>
        )}

        {/* Challenge Modal */}
        {challengeModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setChallengeModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="glass-card-static max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="font-heading text-xl mb-4">CHALLENGE {selectedUser.name.toUpperCase()}</h3>
              <p className="text-white/50 text-sm mb-4">Send a 3-day shared challenge. Both complete it → photos unlock + AI conversation opener.</p>
              <div className="p-4 rounded-xl bg-beast-purple/10 border border-beast-purple/20 mb-4">
                <p className="text-sm text-white/80">🏏 Both hit 10K steps for 3 days straight — no excuses</p>
                <p className="text-[10px] text-white/40 mt-1">3-day challenge · Generated by Challenge Agent</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setChallengeModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button>
                <button onClick={() => sendChallenge(selectedUser)} className="flex-1 btn-purple text-sm flex items-center justify-center gap-1">
                  <Send className="w-4 h-4" /> Send Challenge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
