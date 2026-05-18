const http = require("http");
const webSocketServer = require("websocket").server;

let connections = [];

const httpServer = http.createServer();
const webSocket = new webSocketServer({ httpServer });

httpServer.listen(8080, () => console.log("✅ Server running at ws://localhost:8080"));

webSocket.on("request", request => {
    const connection = request.accept(null, request.origin);
    // This line does one job: it accepts the incoming WebSocket handshake and upgrades the connection.
    //     Let's break it down piece by piece:
    // jsconst connection = request.accept(null, request.origin);
    // request — this is the incoming WebSocket upgrade request from the client. It's not a full connection yet, just a knock on the door.
    //     .accept() — this is you opening the door. It tells the client "yes, I allow this connection" and completes the WebSocket handshake. Under the hood it sends back the 101 Switching Protocols HTTP response.
    //     First argument — null — this is the subprotocol. Subprotocols are optional agreements between client and server about message format (like "chat", "json", "mqtt"). Passing null means "no specific protocol, just raw WebSocket." If you passed "chat" here, the client would also need to request "chat" or the handshake would fail.
    //     Second argument — request.origin — this is the origin of the request (like http://localhost:3000). The library uses this to decide whether to allow or reject the connection based on where it came from. Passing request.origin back basically means "accept from any origin." In production you'd check it:
    //     js// production — only allow your own domain
    // if (request.origin !== "https://yoursite.com") {
    //     request.reject();
    //     return;
    // }
    // const connection = request.accept(null, request.origin);
    // const connection — the return value is the actual live WebSocket connection object. This is what you push into your connections[] array and what you call .send() on later.
    //     So the full picture:
    //     request          →   just a handshake attempt, door is still closed
    // request.accept() →   door opens, HTTP upgrades to WebSocket
    // connection       →   the open, persistent, two-way channel you work with
    //     If you wanted to reject a connection instead, you'd do:
    // jsrequest.reject(403, "Not allowed");
    // And the client would never get a live connection at all.

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