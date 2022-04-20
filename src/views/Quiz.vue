<template>
    <section>
        <div class="inner-box">
            <div class="question item">
                Hello, je suis une question !
            </div>
            <div class="answer answer-1 item">Réponse 1</div>
            <div class="answer answer-2 item">Réponse 2</div>
            <div class="answer answer-3 item">Réponse 3</div>
            <div class="answer answer-4 item">Réponse 4</div>
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
    console.log("play")
  },
  updated() {},
};
</script>


<style lang="scss">
section {
    background: rgba(255,255,255,0.15);
    border: 1px gold solid;
    height: 70%;
    padding: 5px;
    .inner-box {
        height: 100%;
        border: 1px gold solid;
        .question {
            margin: 2rem;
            height: 6rem;
            line-height: 6rem;
        }
        .answer {
            margin: 2rem;
            line-height: 3rem;
            height: 3rem;
        }
        .item {
            background: black;
        }
    }
}
</style>