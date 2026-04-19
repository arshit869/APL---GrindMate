import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import { useUser } from '../context/UserContext';
import { Flame, Users, ArrowRight, Zap } from 'lucide-react';

function Dumbbell() {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <group rotation={[0, 0, Math.PI / 4]}>
        {/* Bar */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3, 16]} />
          <meshStandardMaterial color="#FF3366" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Left weight inner */}
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Left weight outer */}
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Right weight inner */}
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Right weight outer */}
        <mesh position={[0, -1.55, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      {/* Glow sphere */}
      <mesh scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial color="#FF3366" transparent opacity={0.05} distort={0.4} speed={2} />
      </mesh>
    </Float>
  );
}

export default function Landing() {
  const [name, setName] = useState('');
  const [squadMode, setSquadMode] = useState('join');
  const [squadCode, setSquadCode] = useState('s1');
  const [squadName, setSquadName] = useState('');
  const navigate = useNavigate();
  const { login, loginAsDemo } = useUser();

  const handleJoin = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          goalType: 'General',
          favoriteWorkout: 'Gym',
          squadCode: squadMode === 'join' ? squadCode : undefined,
          createSquad: squadMode === 'create' ? (squadName || true) : undefined,
        })
      });
      const data = await res.json();
      if (data.user) {
        login(data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Fallback: use demo user
      loginAsDemo();
      navigate('/dashboard');
    }
  };

  const handleDemo = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0D0D 0%, #1A1A2E 100%)' }}
    >
      {/* Three.js Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#FF3366" />
          <pointLight position={[-10, -5, 5]} intensity={0.5} color="#00E5B4" />
          <pointLight position={[0, -10, 5]} intensity={0.3} color="#7B2FBE" />
          <Suspense fallback={null}>
            <Dumbbell />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg mx-auto px-6">
        {/* Logo */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Flame className="w-10 h-10 text-grind-pink" />
          </div>
          <h1 className="font-heading text-6xl md:text-8xl tracking-wider">
            GRIND<span className="gradient-text">MATE</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-white/60 mb-2 font-body"
        >
          Your grind is your profile.
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-white/30 mb-10"
        >
          Compete with your squad · Crush community challenges · Unlock matches through workouts
        </motion.p>

        {/* Entry Form */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card-static space-y-4"
        >
          <input
            type="text"
            placeholder="Enter your grind name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-center text-lg"
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />

          {/* Squad options */}
          <div className="flex gap-2">
            <button
              onClick={() => setSquadMode('join')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                ${squadMode === 'join' ? 'bg-grind-pink/20 text-grind-pink border border-grind-pink/30' : 'bg-white/5 text-white/50 border border-white/10'}`}
            >
              <Users className="w-4 h-4 inline mr-1" /> Join Squad
            </button>
            <button
              onClick={() => setSquadMode('create')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                ${squadMode === 'create' ? 'bg-neon-teal/20 text-neon-teal border border-neon-teal/30' : 'bg-white/5 text-white/50 border border-white/10'}`}
            >
              <Zap className="w-4 h-4 inline mr-1" /> Create Squad
            </button>
          </div>

          {squadMode === 'join' ? (
            <select value={squadCode} onChange={(e) => setSquadCode(e.target.value)} className="w-full">
              <option value="s1">Iron Legion (3 members)</option>
              <option value="s2">Power Queens (1 member)</option>
            </select>
          ) : (
            <input
              type="text"
              placeholder="Squad name..."
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              className="w-full"
            />
          )}

          <button onClick={handleJoin} className="w-full btn-primary flex items-center justify-center gap-2 text-lg">
            Start Your Innings <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Demo shortcut */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleDemo}
          className="mt-4 text-sm text-white/30 hover:text-white/60 transition-colors underline underline-offset-4"
        >
          Quick Demo as Arshit_Grind (847 · Diamond)
        </motion.button>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-2 justify-center mt-8"
        >
          {['7 AI Agents', 'Real-time Squad Wars', 'Fitness Dating', 'Cricket Language', 'Claude API'].map(feat => (
            <span key={feat} className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-white/40 border border-white/10">
              {feat}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
