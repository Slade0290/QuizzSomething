import express from 'express';
import socketIO from 'socket.io';
import http from 'http'

const app = express();
let server = http.Server(app)
const io = socketIO(server)

server.listen(3000, function () {
    console.log('server running on port 3000');
});

io.sockets.on('connection', function (socket) {

    console.log('connection', socket.id)
});
