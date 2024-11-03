const socket = io();

const messageContainer = document.getElementById('messages');
const roastInput = document.getElementById('roastInput');
const sendButton = document.getElementById('sendButton');
const userList = document.getElementById('userList');

const username = prompt("Enter your username:") || "Anonymous";
socket.emit('set username', username);

// Display chat history
socket.on('chat history', (messages) => {
    messages.forEach((msg) => {
        displayMessage(msg);
    });
});

// Display user list
socket.on('user list', (users) => {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
});

// Display new roast messages
socket.on('roast message', (msg) => {
    displayMessage(msg);
});

function displayMessage(msg) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // Create avatar
    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.textContent = msg.username.charAt(0).toUpperCase(); // Use first letter of username

    // Create message content
    const content = document.createElement('div');
    content.classList.add('content');
    content.innerHTML = `<span class="username">${msg.username}</span>: ${msg.text}`;

    // Append avatar and content to message element
    messageElement.appendChild(avatar);
    messageElement.appendChild(content);
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the bottom
}

// Send roast messages when the button is clicked
sendButton.addEventListener('click', () => {
    const message = roastInput.value.trim();
    if (message) {
        socket.emit('roast message', message);
        roastInput.value = ''; // Clear input
    }
});

// Allow sending messages with the Enter key
roastInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});
