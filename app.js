import express from 'express';
import socketIO from 'socket.io';

const app = express();
const io = socketIO(server)

app.listen(3001, function () {
    console.log('server running on port 3001');
});

io.sockets.on('connection', function (socket) {

    console.log('connection', socket.id)
});
