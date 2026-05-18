const webSocket = require("websocket").client;

const client1 = new webSocket();
const client2 = new webSocket();
const client3 = new webSocket();

client1.on("connect", connection => {
    console.log("✅ Client 1 connected");
    connection.on("message", msg => console.log("  [Client 1] RECEIVED:", msg.utf8Data));
    connection.send("Hello from Client 1!");
});

client2.on("connect", connection => {
    console.log("✅ Client 2 connected");
    connection.on("message", msg => console.log("  [Client 2] RECEIVED:", msg.utf8Data));
    connection.send("Hello from Client 2!");
});

client3.on("connect", connection => {
    console.log("✅ Client 3 connected");
    connection.on("message", msg => console.log("  [Client 3] RECEIVED:", msg.utf8Data));
    connection.send("Hello from Client 3!");
});

// connect one by one with small delay so you can see each join message
client1.connect("ws://localhost:8080/");
setTimeout(() => client2.connect("ws://localhost:8080/"), 1000);
setTimeout(() => client3.connect("ws://localhost:8080/"), 2000);