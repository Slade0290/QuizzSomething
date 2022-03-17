const { Socket } = require("socket.io");

const express  = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const port = 8080;

/** 
 * @type {Socket}
*/
const io = require('socket.io')(http);

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.get('/games/WarQuizz', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/games/WarQuizz.html'));
});

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

let rooms = [];

io.on('connection', (socket) => {
    console.log(`[connection] ${socket.id}`);

    socket.on('playerData', (player) => {
        console.log(`[playerData] ${player.username}`);
        let room = null;

        if(!player.roomId) {
            room = createRoom(player);
            console.log(`[create room] - ${room.id} - ${player.username}`);
        } else{
            room = rooms.find(r => r.id === player.roomId);

            if(room === undefined){
                return;
            }

            room.players.push(player);
        }

        socket.join(room.id);
        io.to(socket.id).emit('join room', room.id);

        if (room.players.length >= 2){

        }

        socket.on('get rooms', () => {
            io.to(socket.id).emit('list rooms', rooms);
        });
    });
});

function createRoom(player) {
    const room = {id : roomId(), players: []};

    player.roomId = room.id;
    room.players.push(player);
    rooms.push(room);

    return room;
}

function roomId() {
    return Math.random().toString(36).substring(2, 9);
}