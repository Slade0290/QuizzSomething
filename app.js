import express from 'express';
import fetch from 'node-fetch';
import socketIO from 'socket.io';
// import cors from 'cors'
import http from 'http'

const app = express();
// app.use(cors())
let server = http.Server(app)
const io = socketIO(server)

server.listen(3001, function () {
    console.log('server running on port 3001');
});

let rooms = [];

io.sockets.on('connection', function (socket) {

    console.log('connection', socket.id)
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
        console.log("socket.id", socket.id)
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

    // LOAD QUESTION 
    socket.on("LOAD:QUESTION", (roomId) => {
        socket.join(roomId); // CAN CAUSE TROUBLE
        loadQuestion().then((resp, err) => {
            if(resp) {
                io.to(roomId).emit("SHOW:QUESTIONS", (resp));
            } else {
                console.log(err);
            }
        })   
    })

    // SEND ANSWER
    socket.on("END:QUIZ", (score) => {
        console.log("answer:", score)
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

function getRoomById(roomId) {
    return rooms.find(x => x.id === roomId)
}

async function loadQuestion() {
    const APIUrl = 'https://opentdb.com/api.php?amount=1'
    const result = await fetch(`${APIUrl}`)
    const data = await result.json();
    return await showQuestion(data.results[0]);
}

async function showQuestion(data){
    let correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length +1 )), 0, correctAnswer);
    return {"category" : data.category, "difficulty" : data.difficulty, "question" : data.question, "options" : optionsList, "correct" : correctAnswer}
    // CHEAT POSSIBLE: CAN BE SHOWN CLIENT SIDE
}