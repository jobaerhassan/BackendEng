const http = require("http");
const webSocketServer = require("websocket").server;

let connections = [];

const httpServer = http.createServer();
const webSocket = new webSocketServer({ httpServer });

httpServer.listen(8080, () => console.log("✅ Server running at ws://localhost:8080"));

webSocket.on("request", request => {
    const connection = request.accept(null, request.origin);
    const userId = `User${connection.socket.remotePort}`;

    // 1. Add to pool FIRST
    connections.push(connection);

    // 2. Tell EVERYONE (including new user) someone joined
    broadcast(`🟢 ${userId} joined — ${connections.length} online`);

    // 3. Handle incoming messages
    connection.on("message", message => {
        if (message.type === "utf8") {
            broadcast(`${userId}: ${message.utf8Data}`);
        }
    });

    // 4. Handle disconnect — cleanup pool
    connection.on("close", () => {
        connections = connections.filter(c => c !== connection);
        broadcast(`🔴 ${userId} left — ${connections.length} online`);
    });
});

function broadcast(message) {
    connections.forEach(c => c.send(message));
}