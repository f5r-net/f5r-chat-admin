const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {}; // لتخزين المستخدمين
let rooms = {}; // لتخزين الغرف والمستخدمين في كل غرفة

// بيانات الغرف والدول
const countries = {
  'USA': ['Room 1', 'Room 2', 'Room 3'],
  'UK': ['Room 1', 'Room 2'],
  'Canada': ['Room 1', 'Room 2'],
  'Germany': ['Room 1', 'Room 2'],
};

app.use(express.static('public'));

// عند الاتصال بالمستخدم
io.on('connection', (socket) => {
  console.log('A user connected');

  // إضافة المستخدم
  socket.on('add user', (username, callback) => {
    if (users[username]) {
      callback({ success: false });
    } else {
      users[username] = socket.id;
      socket.username = username;  // تعيين اسم المستخدم
      callback({ success: true });
      io.emit('user joined', { username });
    }
  });

  // عند انضمام المستخدم إلى غرفة
  socket.on('join room', (data) => {
    const { username, room } = data;

    // إضافة المستخدم إلى الغرفة المحددة
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = [];
    }
    rooms[room].push(username);

    // إرسال رسالة ترحيب للمستخدمين في الغرفة
    io.to(room).emit('new message', { username: 'System', message: `${username} has joined the room` });
  });

  // عند مغادرة المستخدم
  socket.on('disconnect', () => {
    // إزالة المستخدم من الغرف التي كان فيها
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(user => user !== socket.username);
      if (rooms[room].length === 0) {
        delete rooms[room]; // حذف الغرفة إذا كانت فارغة
      }
    }
    delete users[socket.username]; // حذف المستخدم
    io.emit('user left', { username: socket.username });
  });

  // استقبال الرسائل النصية من المستخدم
  socket.on('new message', (data) => {
    const { room, message } = data;
    io.to(room).emit('new message', { username: socket.username, message });
  });

  // استقبال صورة من المستخدم
  socket.on('send image', (data) => {
    io.to(data.room).emit('receive image', { username: socket.username, image: data.image });
  });

  // بدء الدردشة الصوتية
  socket.on('start voice chat', () => {
    io.emit('voice chat started', { username: socket.username });
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
