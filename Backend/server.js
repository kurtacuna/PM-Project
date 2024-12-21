const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { initializeWebSocketServer } = require('./config/WebSocket.js');

const PORT = process.env.PORT || 3500;

// Parse url-encoded data, json data, and cookies
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// Define routes
app.use('/login', require('./routes/login.js'));
app.use('/student', require('./routes/student.js'));
app.use('/staff', require('./routes/staff.js'));
app.use('/requests', require('./routes/api/requests.js'));
app.use('/documents', require('./routes/api/documents.js'));

// WebSocket server
const server = http.createServer(app);
initializeWebSocketServer(server);

// Start server
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});