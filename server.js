require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const socketIo = require('socket.io');

// อ่านค่าจาก environment variables
const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

const app = express();
const server = https.createServer(options, app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.send('Hello, this is a secure server with socket.io!');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 8443;
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});