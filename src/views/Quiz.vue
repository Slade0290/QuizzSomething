<template>
  <section>
    <div class="inner-box">
      <div class="header">
        <div id="clock" ref="clock">5</div>
        <div class="question" ref="question">Hello, je suis une question !</div>
        <div id="theme" class="item">Thème</div>
      </div>
      <ul>
        <li class="item">
          <input type="checkbox" class="answer" id="one" /><label for="one"
            >Réponse 1</label
          >
        </li>
        <li class="item">
          <input type="checkbox" class="answer" id="two" /><label
            for="two"
            class=""
            >Réponse 2</label
          >
        </li>
        <li class="item">
          <input type="checkbox" class="answer" id="three" /><label
            for="three"
            class=""
            >Réponse 3</label
          >
        </li>
        <li class="item">
          <input type="checkbox" class="answer" id="four" /><label
            for="four"
            class=""
            >Réponse 4</label
          >
        </li>
      </ul>
      <div class="footer">
        <div class="btn-validate item">Validate</div>
      </div>
    </div>
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
        socketId: "",
        win: false,
      },
      socket: io("localhost:3001"),
      roomId: "",
      players: [],
    };
  },
  mounted() {
    console.log("play");
    console.log(Cookies.get('value'))
    this.roomId = this.$route.params.roomId;
    this.startClock();
    this.loadQuestion();
    console.log(this.socket)
    this.socket.on("SHOW:QUESTIONS", (data) => {
      console.log("questions_data", data);
    });
  },
  updated() {},
  methods: {
    startClock: function () {
      console.log("startClock");
      let i = 0;
      let el = this.$refs;
      let timer = null;
      timer = setInterval(function countdown() {
        el.clock.innerText = 5 - i;
        i++;
        if (i == 6) {
          console.log("time's up !");
          clearInterval(timer);
        }
      }, 1000);
    },
    loadQuestion: function () {
      this.socket.emit("LOAD:QUESTION", this.roomId);
    },
  },
};
</script>


<style lang="scss">
$button-bckgnd-color: rgba(0, 86, 100, 1);
$button-bckgnd-color-opacity: rgba(0, 86, 100, 0.5);
section {
  .inner-box {
    height: 100%;
    .header {
      text-align: center;
      #theme {
        background: $button-bckgnd-color;
        display: inline;
        padding: 0.3rem;
        border-radius: 0.3rem;
        font-size: 0.8em;
      }
      .question {
        text-align: center;
        height: 6rem;
        line-height: 6rem;
      }
    }
    .item {
      color: white;
      .answer {
        transition: 0.5s;
        display: none;
        &:checked ~ label {
          background: $button-bckgnd-color-opacity;
          cursor: pointer;
        }
      }
      label {
        display: block;
        box-shadow: 0.05rem 0.05rem 0.1rem 0.05rem rgba(0, 0, 0, 0.3);
        border-radius: 0.3rem;
        background: $button-bckgnd-color;
        margin: 1rem;
        padding: 0.5rem;
        cursor: pointer;
        width: 50%;
        margin: 1rem auto;
        &:active {
          box-shadow: inset 0.05rem 0.05rem 0.1rem 0.05rem rgba(0, 0, 0, 0.3);
        }
        &:hover {
          background: $button-bckgnd-color-opacity;
        }
      }
    }
    .footer {
      text-align: center;
      margin: 2rem;
      .btn-validate {
        display: inline;
        box-shadow: 0.05rem 0.05rem 0.1rem 0.05rem rgba(0, 0, 0, 0.3);
        padding: 0.5rem;
        border-radius: 0.3rem;
        background: $button-bckgnd-color;
        cursor: pointer;
        &:active {
          box-shadow: inset 0.05rem 0.05rem 0.1rem 0.05rem rgba(0, 0, 0, 0.3);
        }
        &:hover {
          background: $button-bckgnd-color-opacity;
        }
      }
    }
  }
}
</style>