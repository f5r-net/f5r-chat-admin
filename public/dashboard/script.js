const users = [
  { username: "User1", status: "Online" },
  { username: "User2", status: "Offline" },
  { username: "User3", status: "Online" },
];

function loadUsers() {
  const userTable = document.getElementById("user-table");
  userTable.innerHTML = ""; // مسح البيانات السابقة

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.status}</td>
      <td>
        <button class="edit" onclick="editUser(${index})">Edit</button>
        <button class="delete" onclick="deleteUser(${index})">Delete</button>
      </td>
    `;
    userTable.appendChild(row);
  });
}

function editUser(index) {
  const newUsername = prompt("Enter new username:", users[index].username);
  if (newUsername) {
    users[index].username = newUsername;
    loadUsers();
  }
}

function deleteUser(index) {
  if (confirm("Are you sure you want to delete this user?")) {
    users.splice(index, 1);
    loadUsers();
  }
}

document.addEventListener("DOMContentLoaded", loadUsers);
