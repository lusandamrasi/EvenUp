require('dotenv').config();
const app = require('./src/app');
const { createServer } = require('http');
const socketIo = require('socket.io');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;
const server = createServer(app);

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`);

  // Join group room for real-time bill updates
  socket.on('join-group', (groupId) => {
    socket.join(`group-${groupId}`);
    logger.info(`Client ${socket.id} joined group ${groupId}`);
  });

  // Leave group room
  socket.on('leave-group', (groupId) => {
    socket.leave(`group-${groupId}`);
    logger.info(`Client ${socket.id} left group ${groupId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});