const { Socket } = require("socket.io");

const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const { log } = require("console");
const port = 8080;

/** 
 * @type {Socket}
*/
const io = require('socket.io')(http);

app.use('/bootstrap/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/templates/index.html'));
});

app.get('/games/WarQuizz', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/templates/games/WarQuizz.html'));
});

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

let rooms = [];
let players = [];

io.on('connection', (socket) => {

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

        socket.join(room.id);
        io.to(socket.id).emit('join room', room.id);
    });

    socket.on('get rooms', () => {
        io.emit('list rooms', rooms);
    });

    socket.on('get players', () => {
        io.to(socket.id).emit('list players', players);
    })

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
                index =+ 1;
            })
        })
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