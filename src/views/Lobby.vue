<template>
  <section>
    <h1 class="title">OLYMPIE</h1>
    <section class="sub-section">
      <h2 class="subtitle">QUIZ</h2>
      <div class="container">
        <div v-if="!player.username" class="username-input-region box">
          <div class="box-inner">
            <label for="username" class="question">PSEUDO</label>
            <input
              type="text"
              ref="username"
              id="username"
              class="answer"
              required
            />
          </div>
        </div>
        <div v-if="!player.username" class="create-room-region box">
          <div>CREER UN SALON PRIVE</div>
          <button v-on:click="submit" class="create-room">GO</button>
        </div>
        <div v-if="!player.roomId" class="rooms-list-region box">
          <div>LISTE DES SALONS</div>
          <ul>
            <li v-for="room in rooms" :key="room.id">
              {{ room.id }}
              <button v-on:click="join(room.id)">Join</button>
            </li>
          </ul>
        </div>
        <div v-if="player.username" class="players-list box">
          <div>LISTE DES JOUEURS</div>
          <ul>
            <li v-for="player in players" :key="player.username" class="player-name">
              {{ player.username }}
            </li>
          </ul>
          <button v-if="player.host" v-on:click="start">Start</button>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import io from "socket.io-client";
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      player: {
        host: false,
        roomId: null,
        username: "",
        cookieId: "",
        socketId: "",
        win: false,
      },
      socket: io("localhost:3001"),
      rooms: [],
      players: [],
    };
  },
  mounted() {
    this.socket.on('connect', () => {
      if(!Cookies.get('Olympie')) {
        Cookies.set('Olympie', this.socket.id)
      }
    })

    this.roomList();
    this.socket.on("LIST:PLAYERS", (players) => {
      this.players = players;
    });
    this.socket.on("PLAY:QUIZ", (player) => {
      this.$router.push({ name: 'quiz', params: { 'roomId' : player.roomId } });
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
      Cookies.set('player.roomId', this.player.roomId)
      Cookies.set('player.socketId', this.player.socketId)
      Cookies.set('player.username', this.player.username)
      this.socket.emit("START:QUIZ", this.player);
    },
    join: function (roomId) {
      this.playerData();
      this.player.roomId = roomId;
      this.socket.emit("JOIN:ROOM", this.player, roomId);
      this.playerList();
      console.log("this.player.socketId : ", this.player.socketId)
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
      this.player.cookieId = Cookies.get('value');
      this.player.socketId = this.socket.id
    },
  },
};
</script>

<style lang="scss">
$mainBackground: rgba(131, 128, 182, 1);
@font-face {
 font-family: "Organic Relief";
 src: url("../assets/fonts/Organic Relief.ttf");
}
  html, body, #app{
    height: 100%;
    font-family: "Organic Relief";
    background: $mainBackground;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(17, 29, 74, 1);
  }
  
  .sub-section {
    display: flex;
    align-items: center;
    flex-direction: column;
    background: rgba(255,255,255,0.6);
    padding: 2rem;
    box-shadow: .15rem .15rem .1rem .05rem rgba(0,0,0,0.3);
    border-radius: 1rem;
    min-width: 50vw;
    min-height: 60vh;
    margin: 2rem;
  }
  button {
    border: none;
  }
  .container {
    display: grid;
    grid-template-areas: 
      "name name"
      "create list";
    grid-template-columns: 1fr 1fr;
    column-gap: .5rem;
    row-gap: .5rem;
  }
  .title {
    text-align: center;
    padding: 1rem;
    font-size: 2em;
    box-shadow: .15rem .15rem .1rem .05rem rgba(0,0,0,0.3);
    margin: 1rem;
    background: rgba(255,255,255,.5);
    border-radius: 2rem;
  }
  .subtitle {
    font-size: 2em;
    padding: 1rem;
  }
  .question {
    // font-size: 1.5em;
  }
  .answer {
    font-size: 1.5em;
  }
  .create-room {
    font-family: "Organic Relief";
    color: white;
    margin: 4rem;
    height: 5rem;
    width: 5rem;
    border-radius: 50%;
    cursor: pointer;
    background: #56d18b;
    transition: .5s;
    &:hover {
      background: #4aa571;
      font-size: 1.5rem;
      height: 6rem;
      width: 6rem;
      margin: 3.5rem;
      // animation
    }
  }
  .username-input-region {
    grid-area: name;
    display: flex;
    flex-direction: column;
  }
  .box {
    border: 1px solid black;
    text-align: center;
    padding: 1rem;
  }
  .box-inner {
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }
  .players-list {
    grid-area: player-list;
    ul {
      list-style: none;
      padding: 0;
    }
  }
  .rooms-list-region {
    grid-area: list;
  }
  .create-room-region {
    grid-area: create;
  }
</style>