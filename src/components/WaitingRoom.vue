<template>
    <section>
        <div class="create-room">
            <h3>Créer un salon</h3>
            <label>Nom du salon :</label>
            <input type="text">
            <button>Créer</button>
        </div>
        <div class="rooms-list">
            <h3>Liste des salons</h3>
            <ul>
                <li v-for="room in rooms" :key="room.message">
                    {{ room.message }}
                </li>
            </ul>
        </div>
        <div class="players-list">
            <h3>Liste des joueurs</h3>
            <ul>
                <li v-for="player in players" :key="player.message">
                    {{ player.message }}
                </li>
            </ul>
        </div>
    </section>
</template>

<script>

import io from 'socket.io-client';

export default {
    data() {
        return {
            player: {
                host: false,
                roomId: null,
                username: '',
                socketId: '',
                win: false
            },
            socket : io('localhost:3001'),
            rooms: [],
            players: []
        }
    },
    mounted() {
        this.socket.emit('GET:ROOMS')
        this.socket.on('LIST:ROOMS', (rooms) => {
            this.rooms = rooms
        })
        this.socket.emit('GET:PLAYERS')
        this.socket.on('LIST:PLAYERS', (players) => {
            this.players = players
        })
    }
}
</script>

<style>
.players-list {
    /*display: none;*/
}
</style>