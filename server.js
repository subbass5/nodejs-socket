require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const socketIo = require('socket.io');
const PORT = process.env.PORT || 3000;
const PORT_HTTPS = process.env.PORT_HTTPS || 443;
// อ่านค่าจาก environment variables
const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

const app = express();

// เซิร์ฟเวอร์ HTTPS
const httpsServer = https.createServer(options, app);
const httpsIo = socketIo(httpsServer);

// เซิร์ฟเวอร์ HTTP
const httpServer = http.createServer(app);
const httpIo = socketIo(httpServer);

app.get('/', (req, res) => {
    res.send('Hello, this is a secure server with socket.io!');
});

// ตั้งค่า socket.io สำหรับ HTTPS
httpsIo.on('connection', (socket) => {
    console.log('A user connected via HTTPS');

    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        httpsIo.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// ตั้งค่า socket.io สำหรับ HTTP
httpIo.on('connection', (socket) => {
    console.log('A user connected via HTTP');

    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        httpIo.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


httpServer.listen(PORT, () => {
    console.log(`HTTP server is running on http://localhost:${PORT}`);
});

httpsServer.listen(PORT_HTTPS, () => {
    console.log(`HTTPS server is running on https://localhost:${PORT_HTTPS}`);
});

