export const streamSocket = new WebSocket('ws://127.0.0.1:8000/ws/stream/');

streamSocket.onclose = function(e) {
    console.error('Failed!');
}

