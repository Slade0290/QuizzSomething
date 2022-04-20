import Vue from 'vue'
import Router from 'vue-router'
import Lobby from './views/Lobby.vue'
import Quiz from './views/Quiz.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'lobby',
      component: Lobby
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: Quiz
    }
  ]
})
