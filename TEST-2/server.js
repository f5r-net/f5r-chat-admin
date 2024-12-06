const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {}; // لتخزين المستخدمين المتصلين

// تقديم الملفات الثابتة
app.use(express.static('public'));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// إدارة اتصال Socket.io
io.on('connection', (socket) => {
  console.log('User connected');

  // إضافة مستخدم
  socket.on('add user', (username, callback) => {
    if (users[username]) {
      callback({ success: false });
    } else {
      users[username] = socket.id;
      socket.username = username;
      callback({ success: true });
    }
  });

  // انضمام إلى غرفة
  socket.on('join room', (data) => {
    socket.join(data.room);
    io.to(data.room).emit('new message', {
      username: 'System',
      message: `${data.username} has joined the room.`,
    });
  });

  // إرسال رسالة
  socket.on('new message', (data) => {
    io.to(data.room).emit('new message', {
      username: socket.username,
      message: data.message,
    });
  });

  // فصل المستخدم
  socket.on('disconnect', () => {
    delete users[socket.username];
  });
});

// تشغيل السيرفر
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
