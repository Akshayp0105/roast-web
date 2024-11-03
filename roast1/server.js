const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let messages = []; // In-memory storage for past messages
let users = {}; // In-memory storage for connected users

// Serve static files from the 'public' directory
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Prompt for username and store it
    socket.on('set username', (username) => {
        users[socket.id] = username;
        
        // Send past messages and user list to the new user
        socket.emit('chat history', messages);
        io.emit('user list', Object.values(users));
    });

    // Listen for new roast messages from clients
    socket.on('roast message', (msg) => {
        const message = { username: users[socket.id], text: msg, timestamp: new Date() };
        messages.push(message); // Save message in history

        // Limit messages history to the last 50 messages
        if (messages.length > 50) {
            messages.shift();
        }

        io.emit('roast message', message); // Broadcast message to all clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete users[socket.id]; // Remove user from list
        io.emit('user list', Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
