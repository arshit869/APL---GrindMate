import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SocketProvider } from './context/SocketContext';
import { UserProvider } from './context/UserContext';
import { AgentProvider } from './context/AgentContext';
import Navbar from './components/Navbar';
import AgentPanel from './components/AgentPanel';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Checkin from './pages/Checkin';
import Squad from './pages/Squad';
import GrindMatch from './pages/GrindMatch';
import Profile from './pages/Profile';
import Arena from './pages/Arena';
import League from './pages/League';
import Admin from './pages/Admin';

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-void">
      {/* Floating particles background */}
      <div className="particles-bg">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 10}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: [
                'rgba(255, 51, 102, 0.2)',
                'rgba(0, 229, 180, 0.2)',
                'rgba(255, 215, 0, 0.15)',
                'rgba(123, 47, 190, 0.2)',
              ][Math.floor(Math.random() * 4)]
            }}
          />
        ))}
      </div>

      {!isLanding && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkin" element={<Checkin />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/grindmatch" element={<GrindMatch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/league" element={<League />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AnimatePresence>

      {!isLanding && <AgentPanel />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <SocketProvider>
        <UserProvider>
          <AgentProvider>
            <AppContent />
          </AgentProvider>
        </UserProvider>
      </SocketProvider>
    </Router>
  );
}
