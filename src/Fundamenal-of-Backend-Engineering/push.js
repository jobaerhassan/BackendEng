const http = require("http");
const webSocketServer = require("websocket").server
let connections = []

const httpServer = http.createServer()

const webSocket = new webSocketServer({ "httpServer": httpServer});

httpServer.listen(8080, () => console.log('server is running at 8080'));

webSocket.on("request", request => {
    const connection = request.accept(null, request.origin);
    connection.on("message", message => {
        // some one sends a message. tell everybody
        connections.forEach(c => c.send(`User${connection.socket.remotePort} says: ${message.utf8Data}`));

    })
    connections.push(connection);
    connections.forEach(con => con.send(`User${connection.socket.remotePort} just connected`));
})