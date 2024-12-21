const WebSocket = require('ws');
const db = require('../model/database.js');

const initializeWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            ws.username = data.username;
            ws.role = data.role;
        });
    });

    setInterval(async () => {
        console.log('database polled');
        const [documents] = await db.query(`
            SELECT * FROM request_with_details ORDER BY date_requested DESC
        `);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                if (client.role === 'student') {
                    const studentDocuments = documents.filter(document => document.student_id === client.username);
                    client.send(JSON.stringify(studentDocuments));
                } else if (client.role === 'staff') {
                    client.send(JSON.stringify(documents));
                }
            }
        });
    }, 5000);
}

module.exports = { initializeWebSocketServer }

