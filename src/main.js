import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Lobby from './components/Lobby.vue'
import Quiz from './components/Quiz.vue'

Vue.config.productionTip = false
Vue.use(VueRouter);


const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {path: '/', name:'Olympie', component: Lobby},
    {path: '/quiz', name:'Mouseîon', component: Quiz}
  ]
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
