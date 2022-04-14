<template>
  <section>
    <div class="create-room">
      <div class="mb-3">
        <label for="username" class="form-label">Nom d'utilisteur</label>
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
      <div class="rooms-list">
        <h3>Liste des salons</h3>
        <ul>
          <li v-for="room in rooms" :key="room.id">
            {{ room.id }}
          </li>
        </ul>
      </div>
      <div class="players-list">
        <h3>Liste des joueurs</h3>
        <ul>
          <li v-for="player in players" :key="player.username">
            {{ player.username }}
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
    this.roomList();
    //this.playerList();
  },
  updated() {
    this.roomList();
    //this.playerList();
  },
  methods: {
    submit: function (event) {
      this.player.username = this.$refs.username.value;
      this.player.host = true;
      this.player.socketId = this.socket.id;
      this.socket.emit("playerData", this.player);
    },
    roomList: function (event) {
      this.socket.emit("GET:ROOMS");
      this.socket.on("LIST:ROOMS", (rooms) => {
        this.rooms = rooms;
      });
    },
    playerList: function (event) {
      this.socket.emit("GET:PLAYERS");
      this.socket.on("LIST:PLAYERS", (players) => {
        this.players = players;
      });
    },
  },
};
</script>

<style>
.players-list {
  /*display: none;*/
}
</style>