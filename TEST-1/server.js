const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // إضافة المستخدم
  socket.on('add user', (username, callback) => {
    if (users.includes(username)) {
      callback({ success: false });
    } else {
      users.push(username);
      socket.username = username; // تعيين اسم المستخدم
      callback({ success: true });
      io.emit('user joined', { username });
    }
  });

  // عند مغادرة المستخدم
  socket.on('disconnect', () => {
    users = users.filter((user) => user !== socket.username);
    io.emit('user left', { username: socket.username });
  });

  // استقبال رسالة جديدة
  socket.on('new message', (data) => {
    io.emit('new message', { username: socket.username, message: data.message });
  });

  // استقبال صورة
  socket.on('send image', (data) => {
    io.emit('receive image', { username: socket.username, image: data.image });
  });

  // بدء الدردشة الصوتية
  socket.on('start voice chat', () => {
    if (socket.username) {
      io.emit('voice chat started', { username: socket.username });
    } else {
      console.error('Username not set for this socket');
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
