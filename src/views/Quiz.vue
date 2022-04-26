<template>
  <section>
    <h1 class="title">OLYMPIE</h1>
      <section class="sub-section">
          <div class="inner-box">
            <div class="header">
              <div id="clock" ref="clock">30</div>
              <div class="question" ref="question">HELLO JE SUIS UNE QUESTION !</div>
              <div id="theme" class="item">THEME</div>
            </div>
            <ul>
              <li class="item">
                <input type="checkbox" class="answer" id="one"/><label for="one">REPONSE 1</label>
              </li>
              <li class="item">
                <input type="checkbox" class="answer" id="two"/><label for="two" class="">REPONSE 2</label>
              </li>
              <li class="item">
                <input type="checkbox" class="answer" id="three"/><label for="three" class="">REPONSE 3</label>
              </li>
              <li class="item">
                <input type="checkbox" class="answer" id="four"/><label for="four" class="">REPONSE 4</label>
              </li>
            </ul>
            <div class="footer">
              <div class="btn-validate item">VALIDER</div>
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
    startClock: function() {
      let i = 0;
      let el = this.$refs
      let timer = null
      let initialValue = 30;
      let countdownSecond = 30;
      timer = setInterval(function countdown() {
        let timeLeft = countdownSecond - i
        el.clock.innerText = timeLeft;
        let progression = 100 - timeLeft / initialValue * 100;
        el.clock.style.background = `linear-gradient(90deg, rgba(17, 29, 74,1) ${progression}%, rgba(23,219,49,1) ${progression+5}%)`
        i++;
        // use animation instead
        if(i == countdownSecond + 1) {
          console.log("time's up !")
          clearInterval(timer)
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
$button-bckgnd-color: rgba(108, 190, 237, 1);
$button-bckgnd-color-opacity: rgba(23,219,49,1);
section {
    .inner-box {
      ul {
        list-style-type: none;
        padding: 0;
      }
      height: 100%;
      .header {
        text-align: center;
          #clock {
            transition: .5s;
            text-align: center;
            color: white;
            border-radius: .5rem;
            background: linear-gradient(90deg, rgba(17, 29, 74,1) 0%, rgba(23,219,49,1) 0%);
            box-shadow: .05rem .05rem .1rem .05rem rgba(0,0,0,0.3);
          }
          #theme {
            background: $button-bckgnd-color;
            display: inline;
            padding: .3rem;
            border-radius: .3rem;
            font-size: .8em;
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
              transition: 0.5s;
              display: block;
              box-shadow: .05rem .05rem .1rem .05rem rgba(0,0,0,0.3);
              border-radius: .3rem;
              background: $button-bckgnd-color;
              margin: 1rem;
              padding: 0.5rem;
              cursor: pointer;
              width: 50%;
              margin: 1rem auto;
              &:active {
                box-shadow: inset .05rem .05rem .1rem .05rem rgba(0,0,0,0.3);
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
            box-shadow: .05rem .05rem .1rem .05rem rgba(0,0,0,0.3);
            padding: .5rem;
            border-radius: .3rem;
            background: $button-bckgnd-color;
            cursor: pointer;
            &:active {
              box-shadow: inset .05rem .05rem .1rem .05rem rgba(0,0,0,0.3);
            }
            &:hover {
              background: $button-bckgnd-color-opacity;
            }
          }
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
</style>