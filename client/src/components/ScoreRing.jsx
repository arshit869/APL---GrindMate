import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ScoreRing({ score = 0, maxScore = 1000, size = 200, strokeWidth = 12, label, tier }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    // Animate score count-up
    const duration = 1500;
    const startTime = Date.now();
    const startVal = animatedScore;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(startVal + (score - startVal) * eased);
      setAnimatedScore(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score / maxScore, 1);
  const dashOffset = circumference * (1 - percentage);

  // Gradient color based on tier
  const tierColors = {
    Bronze: ['#CD7F32', '#8B4513'],
    Silver: ['#C0C0C0', '#808080'],
    Gold: ['#FFD700', '#FFA500'],
    Platinum: ['#00CED1', '#008B8B'],
    Diamond: ['#4169E1', '#1E90FF'],
    Legend: ['#FFD700', '#FF3366'],
  };

  const [color1, color2] = tierColors[tier] || ['#FF3366', '#FF6B9D'];
  const gradientId = `scoreGrad-${size}`;

  return (
    <div className="score-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
        />
        
        {/* Animated fill ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          filter="url(#glow)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl md:text-5xl font-bold tracking-tighter" style={{ color: color1 }}>
          {animatedScore}
        </span>
        {label && <span className="text-white/40 text-xs mt-1 uppercase tracking-widest">{label}</span>}
        {tier && (
          <span className={`tier-badge tier-${tier.toLowerCase()} text-[10px] mt-2`}>
            {tier}
          </span>
        )}
      </div>
    </div>
  );
}
