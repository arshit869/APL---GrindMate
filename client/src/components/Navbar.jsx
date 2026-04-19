import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Users, 
  Heart, 
  User, 
  Trophy, 
  Swords,
  Flame
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/checkin', label: 'Check-in', icon: Dumbbell },
  { path: '/squad', label: 'Squad', icon: Users },
  { path: '/arena', label: 'Arena', icon: Swords },
  { path: '/grindmatch', label: 'GrindMatch', icon: Heart },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/league', label: 'League', icon: Trophy },
];

export default function Navbar() {
  const { user } = useUser();
  const { connected } = useSocket();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-void/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-grind-pink" />
            <span className="font-heading text-xl tracking-wider text-white">
              GRIND<span className="text-grind-pink">MATE</span>
            </span>
          </NavLink>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                   ${isActive 
                     ? 'text-grind-pink bg-grind-pink/10' 
                     : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                   }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-neon-teal' : 'bg-red-500'}`} />
              <span className="text-xs text-white/40 hidden sm:inline">{connected ? 'Live' : 'Offline'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="font-mono text-sm font-bold text-gold">💰 {user?.coins || 0}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="font-mono text-sm font-bold text-grind-pink">{user?.fitScore || 0}</span>
              <span className="text-xs text-white/40">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-void/95 backdrop-blur-xl border-t border-white/5 z-50">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.slice(0, 5).map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-all
                 ${isActive ? 'text-grind-pink' : 'text-white/40'}`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
