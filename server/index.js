const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidates');
const jobRoutes = require('./routes/jobs');
const matchingRoutes = require('./routes/matching');
const evaluationRoutes = require('./routes/evaluation');
const gameRoutes = require('./routes/games');
const applicationRoutes = require('./routes/applications');
const challengeRoutes = require('./routes/challenges');
const meetingRoutes = require('./routes/meetings');

// Import AI services
const { parseResume } = require('./services/resumeParser');
const { calculateMatch } = require('./services/aiMatching');
const { evaluateSkills } = require('./services/skillEvaluation');
const { generateCodingChallenge } = require('./services/codingChallenges');

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/meetings', meetingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'TalentAI Server Running',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join candidate room for real-time updates
  socket.on('join-candidate', (candidateId) => {
    socket.join(`candidate-${candidateId}`);
  });
  
  // Join recruiter room
  socket.on('join-recruiter', (recruiterId) => {
    socket.join(`recruiter-${recruiterId}`);
  });
  
  // Handle coding challenge submissions
  socket.on('submit-challenge', async (data) => {
    try {
      const result = await evaluateSkills(data.candidateId, data.challengeId, data.solution);
      io.to(`candidate-${data.candidateId}`).emit('challenge-result', result);
      io.to(`recruiter-${data.recruiterId}`).emit('candidate-update', {
        candidateId: data.candidateId,
        challengeResult: result
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to evaluate challenge' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 TalentAI Server running on port ${PORT}`);
  console.log(`📊 AI-Powered Talent Matching System Active`);
  console.log(`🎯 Ready to process 100K+ AI talent profiles`);
});

module.exports = { app, io };
