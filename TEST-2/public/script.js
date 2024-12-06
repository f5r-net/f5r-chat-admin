const socket = io();
const loginPage = document.getElementById('login-page');
const countryPage = document.getElementById('country-page');
const roomPage = document.getElementById('room-page');
const chatContainer = document.getElementById('chat-container');
const countryList = document.getElementById('country-list');
const roomList = document.getElementById('room-list');
const selectedCountrySpan = document.getElementById('selected-country');
let selectedCountry = null;
let selectedRoom = null;

// قائمة الدول والغرف ثابتة
const countries = {
  'USA': ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Room 11", "Room 12", "Room 13", "Room 14", "Room 15", "Room 16", "Room 17", "Room 18", "Room 19", "Room 20"],
  'UK': ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Room 11", "Room 12", "Room 13", "Room 14", "Room 15", "Room 16", "Room 17", "Room 18", "Room 19", "Room 20"],
  'Canada': ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Room 11", "Room 12", "Room 13", "Room 14", "Room 15", "Room 16", "Room 17", "Room 18", "Room 19", "Room 20"],
  'Germany': ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Room 11", "Room 12", "Room 13", "Room 14", "Room 15", "Room 16", "Room 17", "Room 18", "Room 19", "Room 20"],
  'France': ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Room 11", "Room 12", "Room 13", "Room 14", "Room 15", "Room 16", "Room 17", "Room 18", "Room 19", "Room 20"],
  'Italy': ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Room 11", "Room 12", "Room 13", "Room 14", "Room 15", "Room 16", "Room 17", "Room 18", "Room 19", "Room 20"],
  'Japan': ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Room 11", "Room 12", "Room 13", "Room 14", "Room 15", "Room 16", "Room 17", "Room 18", "Room 19", "Room 20"],
  'Australia': ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Room 11", "Room 12", "Room 13", "Room 14", "Room 15", "Room 16", "Room 17", "Room 18", "Room 19", "Room 20"],
  'India': ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Room 11", "Room 12", "Room 13", "Room 14", "Room 15", "Room 16", "Room 17", "Room 18", "Room 19", "Room 20"],
  'Brazil': ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Room 11", "Room 12", "Room 13", "Room 14", "Room 15", "Room 16", "Room 17", "Room 18", "Room 19", "Room 20"]
};

// تسجيل الدخول
function setUsername() {
  const usernameInput = document.getElementById('username-input').value.trim();
  if (usernameInput) {
    socket.emit('add user', usernameInput, (response) => {
      if (response.success) {
        socket.username = usernameInput;
        loginPage.style.display = 'none';
        countryPage.style.display = 'block';
        loadCountries();
      } else {
        alert('Username is already taken!');
      }
    });
  }
}

// تحميل الدول
function loadCountries() {
  countryList.innerHTML = '';
  for (const country in countries) {
    const button = document.createElement('button');
    button.className = 'country-button';
    button.textContent = country;
    button.onclick = () => selectCountry(country, countries[country]);
    countryList.appendChild(button);
  }
}

// اختيار دولة
function selectCountry(country, rooms) {
  selectedCountry = country;
  countryPage.style.display = 'none';
  roomPage.style.display = 'block';
  selectedCountrySpan.textContent = country;
  loadRooms(rooms);
}

// تحميل الغرف
function loadRooms(rooms) {
  roomList.innerHTML = '';
  rooms.forEach((room) => {
    const button = document.createElement('button');
    button.className = 'room-button';
    button.textContent = room;
    button.onclick = () => selectRoom(room);
    roomList.appendChild(button);
  });
}

// العودة إلى صفحة الدول
function goBackToCountries() {
  roomPage.style.display = 'none';
  countryPage.style.display = 'block';
}

// اختيار غرفة
function selectRoom(room) {
  selectedRoom = room;
  socket.emit('join room', { username: socket.username, room });
  roomPage.style.display = 'none';
  chatContainer.style.display = 'flex';
}

// إرسال رسالة
function sendMessage() {
  const messageInput = document.getElementById('message-input').value.trim();
  if (messageInput && selectedRoom) {
    socket.emit('new message', { room: selectedRoom, message: messageInput });
    document.getElementById('message-input').value = '';
  }
}

// إرسال صورة
function sendImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      socket.emit('send image', { room: selectedRoom, image: reader.result });
    };
    reader.readAsDataURL(file);
  }
}

// استقبال الرسائل
socket.on('new message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
  document.getElementById('messages').appendChild(messageElement);
});

// استقبال الصور
socket.on('receive image', (data) => {
  const imageElement = document.createElement('div');
  imageElement.classList.add('message');
  imageElement.innerHTML = `<strong>${data.username}:</strong> <img src="${data.image}" style="max-width: 100%;"/>`;
  document.getElementById('messages').appendChild(imageElement);
});
