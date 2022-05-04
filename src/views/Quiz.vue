<template>
  <section>
    <h1 class="title">OLYMPIE</h1>
      <section class="sub-section">
          <div class="inner-box">
            <div class="header">
              <div id="clock" ref="clock">3</div>
              <div class="question" ref="question">QUESTION</div>
              <div ref="theme" class="item theme">THEME</div>
            </div>
            <ul>
              <li v-for="(answer, index) in answers" :key="answer" class="item">
                <input type="radio"
                        class="answer" 
                        name="radios" 
                        v-model="radios" 
                        :id="index" 
                        v-bind:value="answer"/>
                        <label :for="index" :ref="'answer'+index" class="answer-label">{{answer}}</label>
              </li>
            </ul>
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
      socket: io("localhost:3001"),
      roomId: "",
      players: [],
      answers: [],
      answer: "",
      radios: "",
      difficulty: "",
      score: 0,
      nbQuestions: 0,
    };
  },
  mounted() {
    console.log("play");
    this.roomId = this.$route.params.roomId;
    this.showQuestion();
    this.loadQuestion();
  },
  updated() {},
  methods: {
    startClock: function (duration) {
      let i = 0;
      let timer = null;
      let countdownSecond = duration;
      timer = setInterval(() => {
        let timeLeft = countdownSecond - i;
        this.$refs.clock.innerText = timeLeft;
        let progression = 100 - (timeLeft / duration) * 100;
        this.$refs.clock.style.background = `linear-gradient(90deg, rgba(17, 29, 74,1) ${progression}%, rgba(23,219,49,1) ${
          progression + 5
        }%)`;
        i++;
        if (i == countdownSecond + 1) {
          clearInterval(timer);
          this.checkAnswer();
        }
      }, 1000);
    },
    checkAnswer: function() {
      const answer = this.radios
      const goodAnswer = (answer === this.answer)
      if(goodAnswer){
        if(this.difficulty == "easy"){
          this.score++;
        }else if (this.difficulty == "medium"){
          this.score+=3;
        }else{
           this.score+=5;
        }
      } 
      // UGLY
      for(let i = 0; i < this.answers.length; i++) {
        if(this.$refs['answer'+i][0].innerText.toLowerCase() === answer.toLowerCase()) {
          if(!goodAnswer) {
            this.$refs['answer'+i][0].style.background = 'red'
          } 
        }
        if(this.$refs['answer'+i][0].innerText.toLowerCase() === this.answer.toLowerCase()) {
          this.$refs['answer'+i][0].style.background = '#17db31'
        }
      }
      this.nbQuestions++;
      if (this.nbQuestions < 2) {
        setTimeout(this.loadQuestion, 3000)
      } else {
        this.socket.emit("END:QUIZ", this.score);
      }
    },
    loadQuestion: function() {
      this.startClock(3);
      this.socket.emit("LOAD:QUESTION", this.roomId);      
    },
    showQuestion: function() {
      this.socket.on("SHOW:QUESTIONS", (data) => {
        console.log("questions_data", data);
        this.$refs.question.innerText = this.decodeHtmlCharCodes(data.question);
        this.answers = data.options;
        this.$refs.theme.innerText = data.category;
        this.answer = data.correct;
        let difficulty = this.difficulty = data.difficulty;
        let color = "";
        console.log("difficulty:", difficulty);
        if (difficulty === "easy") {
          color = "green";
        } else if (difficulty === "hard") {
          color = "red";
        } else {
          color = "orange";
        }
        this.$refs.theme.style.background = color;
      });
    },
    decodeHtmlCharCodes: function (str) {
      return str
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&eacute;/g, "É");
    },
  },
};
</script>


<style lang="scss">
$button-bckgnd-color: rgba(108, 190, 237, 1);
$button-bckgnd-color-opacity: rgba(23, 219, 49, 1);
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
        transition: 0.5s;
        text-align: center;
        color: white;
        border-radius: 0.5rem;
        background: linear-gradient(
          90deg,
          rgba(17, 29, 74, 1) 0%,
          rgba(23, 219, 49, 1) 0%
        );
        box-shadow: 0.05rem 0.05rem 0.1rem 0.05rem rgba(0, 0, 0, 0.3);
      }
      .theme {
        display: inline-block;
        padding: 0.3rem;
        border-radius: 0.3rem;
        font-size: 0.8em;
        margin: 2rem;
      }
      .question {
        text-align: center;
        margin: 3rem 3rem 0 3rem;
        text-transform: uppercase;
      }
    }
    .item {
      text-transform: uppercase;
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