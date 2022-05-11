<template>
  <section>
    <h1 class="title">OLYMPIE</h1>
    <section class="sub-section">
      <h2 class="subtitle">QUIZ</h2>
      <div class="container" ref="container">
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
          <button v-on:click="createRoom" class="lets-go-btn">GO</button>
        </div>
        <div v-if="!player.roomId" class="rooms-list-region box">
          <div>LISTE DES SALONS</div>
          <ul>
            <li v-for="room in rooms" :key="room.id">
              <span>{{ room.id }}</span>
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
          <button v-if="player.host" v-on:click="start" class="lets-go-btn">GO</button>
          <div class="roomId">ID : {{player.roomId}}</div>
        </div>
        <div ref="warning" class="warning">
          Ajoute ton pseudo !
        </div>
      </div>
    </section>
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
      socket: io("/socket:3001"),
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
      this.$router.push({ name: 'quiz', params: { 'roomId' : player.roomId } });
    });
    this.player.socketId = this.socket.id
  },
  updated() {
    this.roomList();
  },
  methods: {
    createRoom: function () {
      this.setPlayer()
      if(this.playerHasName()) {
        this.$refs.container.style.gap = 0
        this.player.host = true;
        this.socket.emit("CREATE:ROOM", this.player);
        this.socket.on("ROOM:CREATED", (roomId) => {
          this.player.roomId = roomId;
          this.players.push(this.player);
        });
      }
    },
    join: function (roomId) {
      this.setPlayer()
      if(this.playerHasName()) {
        this.$refs.container.style.gap = 0
        this.player.roomId = roomId
        this.socket.emit("JOIN:ROOM", this.player, roomId)
        this.playerList()
      }
    },
    roomList: function () {
      this.socket.emit("GET:ROOMS");
      this.socket.on("LIST:ROOMS", (rooms) => {
        this.rooms = rooms;
      });
    },
    playerList: function () {
      this.socket.emit("GET:PLAYERS", this.player.roomId);
      this.socket.on("LIST:PLAYERS", (players) => {
        this.players = players;
      });
    },
    playerHasName: function() {
      if(this.$refs.username.value === '') {
        this.$refs.warning.style.right = '1rem'
        setTimeout(() => {
          this.$refs.warning.style.right = '-25rem'
        }, 3000)
        return false
      }
      return true
    },
    setPlayer: function () {
      this.player.username = this.$refs.username.value
    },
    start: function () {
      this.socket.emit("START:QUIZ", this.player);
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
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(17, 29, 74, 1);
    overflow-x: hidden;
  }
  
  .sub-section {
    display: flex;
    align-items: center;
    flex-direction: column;
    background: rgba(255,255,255,0.6);
    padding: 2rem;
    box-shadow: .15rem .15rem .1rem .05rem rgba(0,0,0,0.3);
    border-radius: 1rem;
    max-height: 60vh;
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
    .warning {
      text-transform: uppercase;
      background: lightcoral;
      padding: 2rem;
      position: absolute;
      right: -25rem;
      bottom: 1rem;
      color: white;
      border-left: red solid 1rem;
      transition: 1s;
    }
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
  }
  .answer {
    font-size: 1.5em;
  }
  .lets-go-btn {
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
    .player-name {
      text-transform: uppercase;
    }
  }
  .box-inner {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  .players-list {
    grid-area: player-list;
    ul {
      list-style: none;
      padding: 0;
    }
    .roomId {
      text-transform: uppercase;
    }
  }
  .rooms-list-region {
    grid-area: list;
    ul {
      li {
        display: flex;
        justify-content: space-between;
        text-transform: uppercase;
        padding: .1rem;
        button {
          background: #56d18b;
          color: white;
          font-family: "Organic Relief";
          text-transform: uppercase;
          font-size: .5rem;
          cursor: pointer;
          transition: .5s;
          border-radius: 5px;
          &:hover {
            background: #4aa571;
          }
        }
      }
    }
  }
  .create-room-region {
    grid-area: create;
  }
</style>