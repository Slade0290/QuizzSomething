
const express = require('express');


const app = express();



const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});


const io = require('socket.io')(server);

let rooms = [];
let players = [];

io.on('connection', function(socket) {
    console.log(socket.id)
    socket.on('playerData', (player) => {
        let room = null;

        if (!player.roomId) {
            room = createRoom(player);
            socket.broadcast.emit('list rooms', rooms);
        } else {
            room = rooms.find(r => r.id === player.roomId);

            if (room === undefined) {
                return;
            }

            room.players.push(player);
            players = room.players; 
        }

        //socket.join(room.id);
        io.to(socket.id).emit('join room', room.id);
        console.log(room.id);
        
        //io.to(room.id).emit('start quizz', room.players);
    });
});

function createRoom(player) {
    const room = { id: roomId(), players: [] };

    player.roomId = room.id;
    room.players.push(player);
    rooms.push(room);

    return room;
}

function roomId() {
    return Math.random().toString(36).substring(2, 9);
}