const socket = io();
const usernameInput = document.getElementById('username-input');
const loginPage = document.getElementById('login-page');
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages');

// تعيين اسم المستخدم
function setUsername() {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('add user', username, (response) => {
      if (response.success) {
        loginPage.style.display = 'none';
        chatContainer.style.display = 'flex';
        socket.username = username; // حفظ اسم المستخدم
      } else {
        document.getElementById('error-message').style.display = 'block';
      }
    });
  }
}

// إرسال الرسالة النصية
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('new message', { message });
    messageInput.value = '';
  }
}

// إرسال صورة
function sendImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      socket.emit('send image', { image: reader.result });
    };
    reader.readAsDataURL(file);
  }
}

// بدء الدردشة الصوتية
function startVoiceChat() {
  socket.emit('start voice chat');
}

// دالة للحصول على الوقت الحالي بتنسيق مناسب
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// استقبال الرسائل النصية
socket.on('new message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  // إنشاء العناصر الخاصة باسم المستخدم والوقت
  const usernameTimeElement = document.createElement('div');
  usernameTimeElement.classList.add('username-time');

  const usernameElement = document.createElement('div');
  usernameElement.classList.add('username');
  usernameElement.textContent = data.username;

  const timeElement = document.createElement('span');
  timeElement.classList.add('message-time');
  timeElement.textContent = getCurrentTime();

  // إضافة العناصر في العنصر الرئيسي
  usernameTimeElement.appendChild(usernameElement);
  usernameTimeElement.appendChild(timeElement);

  // إضافة الرسالة أسفل الاسم والتاريخ
  const messageTextElement = document.createElement('p');
  messageTextElement.classList.add('message-text');
  messageTextElement.textContent = data.message;

  messageElement.appendChild(usernameTimeElement);
  messageElement.appendChild(messageTextElement);

  messagesContainer.appendChild(messageElement);
});

// استقبال الصورة
socket.on('receive image', (data) => {
  const imageElement = document.createElement('div');
  imageElement.classList.add('message');

  const usernameTimeElement = document.createElement('div');
  usernameTimeElement.classList.add('username-time');

  const usernameElement = document.createElement('div');
  usernameElement.classList.add('username');
  usernameElement.textContent = data.username;

  const timeElement = document.createElement('span');
  timeElement.classList.add('message-time');
  timeElement.textContent = getCurrentTime();

  const imageTextElement = document.createElement('p');
  imageTextElement.classList.add('message-text');
  imageTextElement.innerHTML = `<img src="${data.image}" style="max-width: 100%;">`;

  usernameTimeElement.appendChild(usernameElement);
  usernameTimeElement.appendChild(timeElement);

  imageElement.appendChild(usernameTimeElement);
  imageElement.appendChild(imageTextElement);

  messagesContainer.appendChild(imageElement);
});

// استقبال إشعار الدردشة الصوتية
socket.on('voice chat started', (data) => {
  const voiceMessage = document.createElement('div');
  voiceMessage.classList.add('message');
  voiceMessage.innerHTML = `<strong>${data.username}:</strong> is speaking...`;
  messagesContainer.appendChild(voiceMessage);
});
