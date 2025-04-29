const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {};

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);

    // Notify all users in the room about the new user
    socket.to(room).emit('user-connected', socket.id);
  });

  socket.on('share-video', ({ room, videoId }) => {
    io.to(room).emit('video-shared', { videoId });
  });

  socket.on('play-video', (room) => {
    io.to(room).emit('play-video');
  });

  socket.on('pause-video', (room) => {
    io.to(room).emit('pause-video');
  });

  socket.on('send-message', ({ room, message }) => {
    io.to(room).emit('receive-message', { message, sender: 'Someone' });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
