
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
    socket.on('PLAYER:INFO', (player) => {
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

    // LIST ROOMS
    socket.on('GET:ROOMS', () => {
        socket.emit('LIST:ROOMS', rooms)
    });

    // LIST PLAYERS
    socket.on('GET:PLAYERS', () => {
        socket.emit('LIST:PLAYERS', players)
    });

    // JOIN ROOM
    socket.on("JOIN:ROOM", (player, roomId) => {
        console.log("Join room")
        console.log(player)
        console.log(roomId)
        // TODO : not done yet
    })
    
    // START QUIZ
    socket.on("START:QUIZ", (socketId) => {
        console.log("Start quiz !")
        console.log(socketId)
        // TODO : not done yet
    })

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
