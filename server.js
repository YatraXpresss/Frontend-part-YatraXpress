const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store active chat rooms
const chatRooms = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_chat', ({ riderId, userId }) => {
    const roomId = `${riderId}_${userId}`;
    socket.join(roomId);
    
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, { messages: [] });
    }
    
    // Send chat history
    const room = chatRooms.get(roomId);
    socket.emit('chat_history', room.messages);
    
    console.log(`User ${userId} joined chat room with rider ${riderId}`);
  });

  socket.on('send_message', (messageData) => {
    const roomId = `${messageData.riderId}_${messageData.userId}`;
    const room = chatRooms.get(roomId);
    
    if (room) {
      room.messages.push(messageData);
      io.to(roomId).emit('receive_message', messageData);
      console.log(`Message sent in room ${roomId}:`, messageData.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
}); 