<template>
  <section>
    <div class="create-room">
      <div class="mb-3">
        <label id="username" ref="username" class="form-label"
          >Nom d'utilisteur</label
        >
        <input
          type="text"
          class="form-control"
          id="username"
          minlength="2"
          maxlength="20"
          placeholder="Saisir votre nom d'utilisateur"
          required
        />
        <button v-on:click="create">Créer un salon privée</button>
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
    this.socket.emit("GET:ROOMS");
    this.socket.on("LIST:ROOMS", (rooms) => {
      this.rooms = rooms;
    });
    this.socket.emit("GET:PLAYERS");
    this.socket.on("LIST:PLAYERS", (players) => {
      this.players = players;
    });
  },
  methods: {
    create: function (event) {
      this.player.username = this.$refs.username;
      this.player.host = true;
      this.player.socketId = this.socket.socketId;
      this.socket.emit("playerData", this.player);
    },
  },
};
</script>

<style>
.players-list {
  /*display: none;*/
}
</style>