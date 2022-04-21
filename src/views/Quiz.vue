<template>
    <section>
        <div class="inner-box">
          <div id="clock" ref="clock">5</div>
          <div class="question">
              Hello, je suis une question !
          </div>
          <div class="item">
            <input type="checkbox" class="answer" id="one"/><label for="one">Réponse 1</label>
          </div>
          <div class="item">
            <input type="checkbox" class="answer" id="two"/><label for="two" class="">Réponse 2</label>
          </div>
          <div class="item">
            <input type="checkbox" class="answer" id="three"/><label for="three" class="">Réponse 3</label>
          </div>
          <div class="item">
            <input type="checkbox" class="answer" id="four"/><label for="four" class="">Réponse 4</label>
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
    console.log("play")
    this.startClock();
  },
  updated() {},
  methods: {
    startClock: function() {
      console.log('startClock')
      let i = 0;
      let el = this.$refs
      let timer = null
      timer = setInterval(function countdown() {
        el.clock.innerText = 5 - i;
        i++;
        if(i == 6) {
          console.log("time's up !")
          clearInterval(timer)
        }
      }, 1000)
    }
  }
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
        .item {
            .answer {
                transition: 0.5s;
                display: none;
                &:checked ~ label {
                  background: rgba(255,255,255,0.15);
                  cursor: pointer;
                  border: 1px white solid;
                }
            }
            label {
              display: block;
              background: black;
              margin: 1rem;
              border: 1px darkgrey solid;
              padding: 0.5rem;
            }
        }
    }
}
</style>