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
      <div v-if="!player.username" class="create-room-region">
        <h3>Créer un salon privé</h3>
        <button v-on:click="submit" class="create-room">Let's go !</button>
      </div>
      <div v-if="!player.roomId" class="rooms-list-region">
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
          <li v-for="player in players" :key="player.username" class="player-name">
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
      this.$router.push('/quiz');
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

<style lang="scss">
  html, body, #app{
    height: 100%;
    background: #dee2e6;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  section {
    display: flex;
    align-items: center;
    flex-direction: column;
    background: white;
    padding: 2rem;
    box-shadow: .05rem .05rem .1rem .05rem rgba(0,0,0,0.3);
    border-radius: 1rem .1rem 1rem .1rem;
    min-width: 50vw;
    min-height: 60vh;
    margin: 0 auto;
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
    &:hover {
      background: #2c6e49;
    }
  }
  .username-input-region {
    grid-area: name;
    display: flex;
    flex-direction: column;
  }
  .box {
    padding: 5px;
  }
  .box-inner {
    padding: 40px;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  .player-list, ul {
    list-style: none;
    padding: 0;
  }
  .rooms-list-region {
    grid-area: list;
    padding: 1rem;
  }
  .create-room-region {
    grid-area: create;
  }
</style>