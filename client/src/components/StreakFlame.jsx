import React from 'react';

export default function StreakFlame({ streak = 0, size = 'md' }) {
  const sizeMap = {
    sm: { container: 'w-8 h-10', text: 'text-xs', flame: '🔥' },
    md: { container: 'w-12 h-16', text: 'text-sm', flame: '🔥' },
    lg: { container: 'w-20 h-24', text: 'text-xl', flame: '🔥' },
    xl: { container: 'w-28 h-32', text: 'text-2xl', flame: '🔥' },
  };

  const config = sizeMap[size] || sizeMap.md;
  
  // Flame intensity based on streak
  const getFlameEmoji = () => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    if (streak >= 1) return '🕯️';
    return '💀';
  };

  const getGlow = () => {
    if (streak >= 30) return 'drop-shadow(0 0 20px rgba(255,100,0,0.7))';
    if (streak >= 14) return 'drop-shadow(0 0 15px rgba(255,100,0,0.5))';
    if (streak >= 7) return 'drop-shadow(0 0 10px rgba(255,100,0,0.4))';
    if (streak >= 1) return 'drop-shadow(0 0 5px rgba(255,200,0,0.3))';
    return 'none';
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className={`${config.container} flex items-center justify-center streak-flame`}
        style={{ filter: getGlow() }}
      >
        <span className={config.text} style={{ fontSize: size === 'xl' ? '2.5rem' : undefined }}>
          {getFlameEmoji()}
        </span>
      </div>
      <span className="font-mono font-bold text-grind-pink">
        {streak}
      </span>
      <span className="text-[10px] text-white/40 uppercase tracking-wider">
        {streak === 1 ? 'day' : 'days'}
      </span>
    </div>
  );
}
