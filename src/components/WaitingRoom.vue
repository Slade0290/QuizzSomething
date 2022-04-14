<template>
  <section>
    <h1 class="title">Olympie</h1>
    <h2 class="subtitle">Mouseîon</h2>
    <div class="container">
      <div class="question-answer box">
        <div class="box-inner">
          <label for="username" class="question">What's your name ?</label>
          <input
            type="text"
            ref="username"
            id="username"
            class="answer"
            required
          />
          <button v-on:click="submit" class="validate-answer">Créer un salon privée</button>
        </div>
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
    this.roomList();
    this.socket.on("LIST:PLAYERS", (players) => {
      this.players = players;
    });
  },
  updated() {
    this.roomList();
  },
  methods: {
    submit: function (event) {
      this.playerData();
      this.player.host = true;
      this.socket.emit("PLAYER:INFO", this.player);
      this.socket.on("ROOM:CREATED", (roomId) => {
        this.player.roomId = roomId;
        this.players.push(this.player);
      });
    },
    start: function (event) {
      console.log("Start quiz !");
      this.socket.emit("START:QUIZ", this.player.socketId);
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
    font-family: 'Greconian';
    src: url(../assets/fonts/Greconian.ttf);
  }
  html, body, #app{
    height: 100%;
    background: radial-gradient(#003, #000);
    overflow: hidden;
    color: white;
  }
  section {
    display: flex;
    flex-direction: column;
    text-align: center;
    flex: 0 1;
    height: 100%;
  }
  input {
    border: none;
  }
  button {
    border: none;
  }
  .title {
    font-family: 'Greconian';
    position: absolute;
    padding: 1rem;
    font-size: 2em;
  }
  .subtitle {
    font-size: 2em;
    padding: 1rem;
  }
  .question {
    font-size: 4em;
  }
  .answer {
    margin: 5rem;
    font-size: 4em;
    padding: 1.5rem;
  }
  .validate-answer {
    margin: 4rem;
    height: 2em;
    font-size: 2em;
    background: #4c956c;
  }
  .validate-answer:hover {
    background: #2c6e49;
  }
  .question-answer {
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
    flex-direction: column;
  }
  .rooms-list {
    padding: 1rem;
  }
</style>