<template>
  <section>
    <div class="create-room">
      <div class="mb-3">
        <label for="username" class="form-label"
          >Nom d'utilisteur</label
        >
        <input
          type="text"
          class="form-control"
          ref="username"
          id="username"
          minlength="2"
          maxlength="20"
          placeholder="Saisir votre nom d'utilisateur"
          required
        />
        <button v-on:click="submit">Créer un salon privée</button>
      </div>
      <div v-if="player.host">Waiting...</div>
      <div v-else class="rooms-list">
        <h3>Liste des salons</h3>
        <ul>
          <li v-for="room in rooms" :key="room.id">
            {{ room.id }}
            <button v-on:click="join(room.id)">Join</button>
          </li>
        </ul>
      </div>
      <div v-if="player.host" class="players-list">
        <h3>Liste des joueurs</h3>
        <ul>
          <li v-for="player in players" :key="player.username">
            {{ player.username }}
          </li>
        </ul>
        <button v-on:click="start">Start</button>
      </div>
    </div>
  </section>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      player: {
        host: false,
        roomId: null,
        username: "",
        socketId: "",
        win: false,
      },
      socket: io("localhost:3001"),
      rooms: [],
      players: [],
    };
  },
  mounted() {
    console.log(this.player.host)
    this.socket.emit("GET:ROOMS");
    this.socket.on("LIST:ROOMS", (rooms) => {
      this.rooms = rooms;
      console.log(rooms)
    });
    this.socket.emit("GET:PLAYERS");
    this.socket.on("LIST:PLAYERS", (players) => {
      this.players = players;
    });
  },
  watch: {
    rooms() {
      console.log(this.rooms)
    }
  },
  methods: {
    submit: function (event) {
      this.player.username = this.$refs.username.value;
      this.player.host = true;
      this.player.socketId = this.socket.id;
      this.socket.emit("PLAYER:INFO", this.player);
    },
    start: function (event) {
      console.log('Start quiz !')
      this.socket.emit("START:QUIZ", this.player.socketId)
    },
    join: function(roomId) {
      console.log(`Join room : ${roomId}`)
      this.socket.emit("JOIN:ROOM", this.player, roomId)
    }
  },
};
</script>

<style>
.players-list {
  /*display: none;*/
}
</style>