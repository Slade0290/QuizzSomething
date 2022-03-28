const player = {
    host: false,
    roomId: null,
    username: "",
    socketId: "",
    win: false
};

const socket = io();

const usernameInput = document.getElementById('username');

const userCard = document.getElementById('user-card');

const waitingArea = document.getElementById('waiting-area');

const roomsCard = document.getElementById('rooms-card');
const playersCard = document.getElementById('players-card');

const roomsList = document.getElementById('rooms-list');
const playersList = document.getElementById('players-list');

socket.emit('get rooms');
socket.on('list rooms', (rooms) => {
    let html = "";

    if (rooms.length > 0) {
        rooms.forEach(room => {
            if (room.players.length >= 1) {
                html += `<li class="list-group-item d-flex justify-content-between">
                <p class="p-0 m-0 flex-grow-1 fw-bold">Salon de ${room.players[0].username} - ${room.id}</p>
                <button class="btn btn-sm btn-success join-room" data-room="${room.id}">Rejoindre</button>
                </li>`;
            }
        });
    }

    if (html !== "") {
        roomsCard.classList.remove('d-none');
        roomsList.innerHTML = html;
    }

    for (const element of document.getElementsByClassName("join-room")) {
        element.addEventListener('click', joinRoom, false);
    }
});

socket.on('start quizz', (players) => {
    for (const element of document.getElementsByClassName("start-quizz")) {
        element.addEventListener('click', startGame, false);
    }
}); 

$("#form").on('submit', function (e) {
    e.preventDefault();

    player.username = usernameInput.value;
    player.host = true;
    player.socketId = socket.id;

    userCard.hidden = true;
    waitingArea.classList.remove('d-none');
    roomsCard.classList.add('d-none');  

    socket.emit('playerData', player);
})

const joinRoom = function () {
    if (usernameInput.value !== "") {
        player.username = usernameInput.value;
        player.socketId = socket.id;
        player.roomId = this.dataset.room;

        socket.emit('playerData', player);
        socket.emit('get players');
        socket.on('list players', (players) => {
            let html = "";

            if (players.length >= 2) {
                players.forEach(player => {
                    html += `<li class="list-group-item d-flex justify-content-between">
                    <p class="p-0 m-0 flex-grow-1 fw-bold">- ${player.username}</p>
                    </li>`;
                });
            }

            if (html !== "") {
                playersCard.classList.remove('d-none');
                playersList.innerHTML = html;
            }
        });
        userCard.hidden = true;
        roomsCard.classList.add('d-none');
    }
}

const startGame = function () {
    console.log("JOUER");
};