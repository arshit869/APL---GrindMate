import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedData } from './seed.js';
import { getAgentLog, getAllUsers } from './state.js';

// Routes
import authRoutes from './routes/auth.js';
import checkinRoutes from './routes/checkin.js';
import squadRoutes from './routes/squad.js';
import fitscoreRoutes from './routes/fitscore.js';
import grindmatchRoutes from './routes/grindmatch.js';
import adminRoutes from './routes/admin.js';

dotenv.config({ path: '../.env' });

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST']
  }
});

// Store io instance for routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
}));
app.use(express.json());

// API Routes
app.use('/api', authRoutes);
app.use('/api', checkinRoutes);
app.use('/api', squadRoutes);
app.use('/api', fitscoreRoutes);
app.use('/api', grindmatchRoutes);
app.use('/api', adminRoutes);

// Serve static files from the React app (Production)
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return;
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), users: getAllUsers().length });
});

// Get agent activity log
app.get('/api/agents/log', (req, res) => {
  const count = parseInt(req.query.count) || 10;
  res.json({ log: getAgentLog(count) });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send initial agent log
  socket.emit('agent:log', getAgentLog(10));

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });

  // Ping/pong for testing
  socket.on('ping', (data) => {
    socket.emit('pong', { ...data, serverTime: new Date().toISOString() });
  });
});

// Seed demo data
seedData();

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║         🏏 GRINDMATE SERVER 🏏          ║
  ║                                          ║
  ║   Your grind is your dating profile.     ║
  ║                                          ║
  ║   Server:  http://localhost:${PORT}          ║
  ║   Socket:  ws://localhost:${PORT}            ║
  ║   Health:  http://localhost:${PORT}/api/health║
  ║                                          ║
  ║   Claude API: ${process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_key_here' ? '✅ Connected' : '⚠️  Mock mode'}             ║
  ╚══════════════════════════════════════════╝
  `);
});
