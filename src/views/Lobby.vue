<template>
  <section>
    <h1 class="title">Olympie</h1>
    <h2 class="subtitle">Quiz</h2>
    <div class="container">
      <div v-if="!player.username" class="username-input-region box">
        <div class="box-inner">
          <label for="username" class="question">Choisis un nom</label>
          <input
            type="text"
            ref="username"
            id="username"
            class="answer"
            required
          />
        </div>
      </div>
      <div class="create-room-region">
        <h3>Créer un salon privé</h3>
        <button v-on:click="submit" class="create-room">Let's go !</button>
      </div>
      <div v-if="player.roomId">Waiting...</div>
      <div v-else class="rooms-list-region">
        <h3>Liste des salons</h3>
        <ul>
          <li v-for="room in rooms" :key="room.id">
            {{ room.id }}
            <button v-on:click="join(room.id)">Join</button>
          </li>
        </ul>
      </div>
      <div v-if="player.username" class="players-list">
        <h3>Liste des joueurs</h3>
        <ul>
          <li v-for="player in players" :key="player.username">
            {{ player.username }}
          </li>
        </ul>
        <button v-if="player.host" v-on:click="start">Start</button>
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
    this.socket.on("LIST:PLAYERS", (players) => {
      this.players = players;
    });
    this.socket.on("PLAY:QUIZ", (player) => {
      this.$router.push("/quiz");
    });
  },
  updated() {
    this.roomList();
  },
  methods: {
    submit: function (event) {
      this.playerData();
      this.player.host = true;
      this.socket.emit("CREATE:ROOM", this.player);
      this.socket.on("ROOM:CREATED", (roomId) => {
        this.player.roomId = roomId;
        this.players.push(this.player);
      });
    },
    start: function (event) {
      this.socket.emit("START:QUIZ", this.player);
    },
    join: function (roomId) {
      this.playerData();
      this.player.roomId = roomId;
      this.socket.emit("JOIN:ROOM", this.player, roomId);
      this.playerList();
    },
    roomList: function (event) {
      this.socket.emit("GET:ROOMS");
      this.socket.on("LIST:ROOMS", (rooms) => {
        this.rooms = rooms;
      });
    },
    playerList: function (event) {
      console.log("In Player List");
      console.log(this.player);
      this.socket.emit("GET:PLAYERS", this.player.roomId);
      this.socket.on("LIST:PLAYERS", (players) => {
        this.players = players;
      });
    },
    playerData: function (event) {
      this.player.username = this.$refs.username.value;
      this.player.socketId = this.socket.id;
    },
  },
};
</script>

<style>
@font-face {
  font-family: "Greconian";
  src: url(../assets/fonts/Greconian.ttf);
}
html,
body,
#app {
  height: 100%;
  background: radial-gradient(#003, #000);
  overflow: hidden;
  color: white;
  font-family: "Greconian";
}
section {
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100%;
  width: 65%;
  justify-content: center;
  margin: 0 auto;
}
input {
  border: none;
}
button {
  border: none;
}
.container {
  display: grid;
  grid-template-areas:
    "name name"
    "create list";
}
.title {
  padding: 1rem;
  font-size: 2em;
}
.subtitle {
  font-size: 2em;
  padding: 1rem;
}
.question {
  font-size: 1.5em;
}
.answer {
  font-size: 1.5em;
}
.create-room {
  color: white;
  margin: 4rem;
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  background: #4c956c;
}
.create-room:hover {
  background: #2c6e49;
}
.username-input-region {
  grid-area: name;
  display: flex;
  flex-direction: column;
}
.box {
  border: 2px solid #b78846;
  padding: 5px;
}
.box-inner {
  border: 2px solid #b78846;
  padding: 40px;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.rooms-list-region {
  grid-area: list;
  padding: 1rem;
}
.create-room-region {
  grid-area: create;
}
</style>