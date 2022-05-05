import { createWebHistory, createRouter } from "vue-router";
import Lobby from './views/Lobby.vue'
import Quiz from './views/Quiz.vue'

const routes = [
  {
    path: '/',
    name: 'lobby',
    component: Lobby
  },
  {
    path: '/quiz/:roomId',
    name: 'quiz',
    component: Quiz
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;