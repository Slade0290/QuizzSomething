<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Lobby />
  </div>
</template>

<script>
// @ is an alias to /src
import Lobby from '@/components/Lobby.vue'

export default {
  name: 'home',
  components: {
    Lobby
  }
}
</script>
