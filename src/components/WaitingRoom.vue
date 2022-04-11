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
        </div>
        <div class="players-list">
            <h3>Liste des joueurs</h3>
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
            socket : io('localhost:3001')
        }
    },
    mounted() {
        this.socket.emit('get rooms')
    }
}
</script>

<style>
.players-list {
    display: none;
}
</style>