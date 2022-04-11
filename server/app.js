
const express = require('express');

const app = express();

const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});

const io = require('socket.io')(server);

let rooms = [{message: "test room"}];
let players = [{message: "test player"}];

io.on('connection', function(socket) {
    console.log(socket.id)

    // LIST ROOMS
    socket.on('GET:ROOMS', () => {
        socket.emit('LIST:ROOMS', rooms)
    });

    // LIST PLAYERS
    socket.on('GET:PLAYERS', () => {
        socket.emit('LIST:PLAYERS', players)
    });
});
