import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoinRain({ active = false, duration = 2500, count = 25 }) {
  const [show, setShow] = useState(active);
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    if (active) {
      setShow(true);
      const newCoins = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        size: 16 + Math.random() * 16,
        rotation: Math.random() * 720,
        duration: 1.5 + Math.random() * 1,
      }));
      setCoins(newCoins);

      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {coins.map(coin => (
          <motion.div
            key={coin.id}
            initial={{ 
              y: -50, 
              x: `${coin.x}vw`, 
              rotate: 0, 
              opacity: 1, 
              scale: 0 
            }}
            animate={{ 
              y: '110vh', 
              rotate: coin.rotation, 
              opacity: [1, 1, 0],
              scale: [0, 1, 0.5]
            }}
            transition={{ 
              duration: coin.duration, 
              delay: coin.delay,
              ease: [0.4, 0, 0.6, 1]
            }}
            className="absolute"
            style={{ width: coin.size, height: coin.size }}
          >
            <div 
              className="w-full h-full rounded-full bg-gradient-to-br from-gold to-amber-600 
                         flex items-center justify-center text-void font-bold shadow-lg shadow-gold/30"
              style={{ fontSize: coin.size * 0.5 }}
            >
              $
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Score popup */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="font-heading text-4xl text-gold text-center"
             style={{ textShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}>
          +50 RUNS
        </div>
      </motion.div>
    </div>
  );
}
