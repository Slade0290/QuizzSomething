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

const roomsList = document.getElementById('rooms-list');

socket.emit('get rooms');
socket.on('list rooms', (rooms) => {
    let html = "";

    if(rooms.length > 0){
        rooms.forEach(room => {
            if(room.players.length >= 1){
                html += `<li class="list-group-item d-flex justify-content-between">
                <p class="p-0 m-0 flex-grow-1 fw-bold">Salon de ${room.players[0].username} - ${room.id}</p>
                <button class="btn btn-sm btn-success join-room" data-room="${room.id}">Rejoindre</button>
                </li>`;  
            } 
        });
    }

    if(html !== ""){
        roomsCard.classList.remove('d-none');
        roomsList.innerHTML = html;
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