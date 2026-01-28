how the client and server communicate, how they understand the http etc will be discussed.
talked about request and response.

PUSH, POLL, LONG POLL

push is implemented at push.js file. implemented with webSocket. created a http server and pass it to the webSocket server.
and send all the messages to the connected connections. that's the overall logic of push. pushing to all devices.