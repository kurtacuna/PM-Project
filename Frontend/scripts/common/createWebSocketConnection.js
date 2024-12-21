export function createWebSocketConnection(username, role) {
    // Establish a WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:3500');

    ws.onopen = (event) => {
        console.log('connected to the websocket server');
        ws.send(JSON.stringify({ username, role }));
    };

    // Receive the updated data from the server
    ws.onmessage = (event) => {
        const requests = event.data;
        const updateDocumentsEvent = new CustomEvent('updateRequests', { detail: { requests } });
        document.body.dispatchEvent(updateDocumentsEvent);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        alert('The WebSocket server connection was lost. Please restart the page or try again later.');
    };
}