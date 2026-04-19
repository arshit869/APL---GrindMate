import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import { useUser } from '../context/UserContext';
import CoinRain from '../components/CoinRain';
import ScoreRing from '../components/ScoreRing';
import { cricketify } from '../lib/cricketLanguage';
import { WORKOUT_TYPES } from '../lib/constants';
import { Dumbbell, Clock, Zap, Camera, CheckCircle, ArrowRight } from 'lucide-react';

export default function Checkin() {
  const { user, updateUser } = useUser();
  const [type, setType] = useState('Gym');
  const [duration, setDuration] = useState(60);
  const [intensity, setIntensity] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCoins, setShowCoins] = useState(false);

  const handleCheckin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'u1',
          type,
          duration,
          intensity
        })
      });
      const data = await res.json();

      if (data.success) {
        setResult(data);
        setSuccess(true);
        setShowConfetti(true);
        setShowCoins(true);

        // Update user context
        if (data.score) {
          updateUser({
            fitScore: data.score.score,
            tier: data.score.tier,
            streak: data.checkin?.streak || user.streak,
            coins: (user.coins || 0) + (data.checkin?.coins || 50),
            todayProgress: data.checkin?.todayProgress || user.todayProgress
          });
        }

        // Stop confetti after a few seconds
        setTimeout(() => setShowConfetti(false), 4000);
      }
    } catch (err) {
      console.error('Check-in error:', err);
      // Demo mode: simulate success
      setSuccess(true);
      setShowConfetti(true);
      setShowCoins(true);
      setResult({
        checkin: { runs: 50, coins: 50, streak: (user?.streak || 0) + 1, streakMilestone: null },
        score: { score: (user?.fitScore || 0) + 23, delta: 23, tier: user?.tier }
      });
      updateUser({
        fitScore: (user?.fitScore || 0) + 23,
        streak: (user?.streak || 0) + 1,
        coins: (user?.coins || 0) + 50,
        todayProgress: Math.min((user?.todayProgress || 0) + 50, user?.goals?.daily || 100)
      });
      setTimeout(() => setShowConfetti(false), 4000);
    }
    setLoading(false);
  };

  const reset = () => {
    setSuccess(false);
    setResult(null);
    setShowCoins(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-container pt-20 px-4 md:px-8"
    >
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} gravity={0.3} 
        colors={['#FF3366', '#00E5B4', '#FFD700', '#7B2FBE']} />}
      <CoinRain active={showCoins} />

      <div className="max-w-xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="heading-lg text-center mb-8"
        >
          {success ? <span className="gradient-text-teal">INNINGS COMPLETE!</span> : 'LOG YOUR WORKOUT'}
        </motion.h1>

        {!success ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card-static space-y-6"
          >
            {/* Workout Type */}
            <div>
              <label className="text-sm text-white/50 mb-2 block">Workout Type</label>
              <div className="grid grid-cols-3 gap-2">
                {WORKOUT_TYPES.map(w => (
                  <button
                    key={w}
                    onClick={() => setType(w)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all
                      ${type === w 
                        ? 'bg-grind-pink/20 text-grind-pink border border-grind-pink/30' 
                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}
                  >
                    {w === 'Gym' && '🏋️'} {w === 'Run' && '🏃'} {w === 'Cycle' && '🚴'}
                    {w === 'Yoga' && '🧘'} {w === 'Walk' && '🚶'} {w === 'Other' && '💪'}
                    <br />{w}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-sm text-white/50 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Duration: <span className="font-mono text-neon-teal">{duration} min</span>
              </label>
              <input
                type="range"
                min="15"
                max="180"
                step="5"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                           [&::-webkit-slider-thumb]:bg-grind-pink [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-grind-pink/30"
              />
              <div className="flex justify-between text-[10px] text-white/30 mt-1">
                <span>15 min</span><span>60 min</span><span>120 min</span><span>180 min</span>
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label className="text-sm text-white/50 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Intensity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map(i => (
                  <button
                    key={i}
                    onClick={() => setIntensity(i)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all
                      ${intensity === i 
                        ? 'bg-neon-teal/20 text-neon-teal border border-neon-teal/30' 
                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}
                  >
                    {i === 'Low' && '🟢'} {i === 'Medium' && '🟡'} {i === 'High' && '🔴'} {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload (visual only) */}
            <div className="p-4 rounded-xl border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-white/20 transition-colors">
              <Camera className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-xs text-white/30">Optional: Upload proof photo</p>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckin}
              disabled={loading}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Dumbbell className="w-5 h-5" /> 
                  CHECK IN — SCORE YOUR RUNS
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          /* Success state */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card-static text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CheckCircle className="w-20 h-20 text-neon-teal mx-auto" />
            </motion.div>

            <div>
              <h2 className="heading-md gradient-text-teal mb-2">BEAST MODE ACTIVATED</h2>
              <p className="text-white/50">{cricketify.checkin(result?.checkin?.runs || 50)}</p>
            </div>

            {/* Score update */}
            <div className="flex items-center justify-center gap-8">
              <ScoreRing 
                score={result?.score?.score || user?.fitScore || 0} 
                size={140}
                strokeWidth={10}
                tier={result?.score?.tier || user?.tier}
              />
              <div className="text-left">
                <div className="font-mono text-3xl font-bold text-neon-teal">
                  +{result?.score?.delta || 23}
                </div>
                <p className="text-sm text-white/40">runs scored</p>
                <div className="mt-2 font-mono text-lg text-gold">
                  +{result?.checkin?.coins || 50} coins
                </div>
                <p className="text-sm text-white/40">
                  Streak: {result?.checkin?.streak || user?.streak || 0} days
                </p>
              </div>
            </div>

            {/* Streak milestone */}
            {result?.checkin?.streakMilestone && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-grind-pink/10 border border-grind-pink/20"
              >
                <p className="font-heading text-lg text-grind-pink">{result.checkin.streakMilestone}</p>
              </motion.div>
            )}

            <button onClick={reset} className="btn-secondary">
              Log Another Workout
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
