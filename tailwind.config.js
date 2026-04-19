/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#0D0D0D',
        'void-light': '#1A1A2E',
        'void-card': 'rgba(255, 255, 255, 0.05)',
        'grind-pink': '#FF3366',
        'grind-pink-dark': '#CC2952',
        'neon-teal': '#00E5B4',
        'neon-teal-dark': '#00B891',
        gold: '#FFD700',
        'gold-dark': '#B8A000',
        'beast-purple': '#7B2FBE',
        'beast-purple-dark': '#5C2390',
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        glass: '10px',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'flame': 'flame 0.5s ease-in-out infinite alternate',
        'coin-fall': 'coinFall 1.5s ease-in forwards',
        'shake': 'shake 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'count-up': 'countUp 1s ease-out',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 51, 102, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 51, 102, 0.6)' },
        },
        flame: {
          '0%': { transform: 'scaleY(1) scaleX(1)' },
          '100%': { transform: 'scaleY(1.1) scaleX(0.95)' },
        },
        coinFall: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
