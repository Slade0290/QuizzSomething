
const express = require('express');

const app = express();

const server = app.listen(3001, function () {
    console.log('server running on port 3001');
});

const io = require('socket.io')(server);

let rooms = [];

io.on('connection', function (socket) {
    console.log(socket.id)
    socket.on('CREATE:ROOM', (player) => {
        let room = null;

        room = createRoom(player);
        socket.emit('ROOM:CREATED', room.id)
        socket.broadcast.emit('LIST:ROOMS', rooms);

        socket.join(room.id);
    });

    // LIST ROOMS
    socket.on('GET:ROOMS', () => {
        socket.emit('LIST:ROOMS', rooms)
    });

    // LIST PLAYERS
    socket.on('GET:PLAYERS', (roomId) => {
        let room = getRoomById(roomId)
        socket.emit('LIST:PLAYERS', room.players)
    });

    // JOIN ROOM
    socket.on("JOIN:ROOM", (player, roomId) => {
        let room = getRoomById(roomId);
        room.players.push(player);
        io.to(roomId).emit('LIST:PLAYERS', room.players)
        socket.join(roomId);
    })

    // START QUIZ
    socket.on("START:QUIZ", (player) => {
        io.to(player.roomId).emit("PLAY:QUIZ", (player));
    })

    // DISCONNECT
    socket.on('disconnect', () => {
        console.log(`[disconnect] ${socket.id}`);

        let room = null;
        let player = null;
        let index = 0;

        //A REMPLACER PAR CODE PLUS OPTI
        rooms.forEach(r => {
            r.players.forEach(p => {
                if (p.socketId === socket.id) {
                    player = p;
                    if (r.players.length <= 1) {
                        room = r;
                        rooms = rooms.filter(r => r !== room);
                    } else if (p.host) {
                        p.host = false;
                        r.players[index + 1].host = true; //A CHANGER PARCE QUE FRAGILE (LODASH)
                    }
                    r.players = r.players.filter(p => p !== player);
                }
                index = + 1;
            });
        });
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

function getRoomById(roomId) {
    return rooms.find(x => x.id === roomId)
}