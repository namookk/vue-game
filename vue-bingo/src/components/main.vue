<template>
  <div>
    <Game/>
    <Chat/>
  </div>
</template>

<script>
import Chat from './chat.vue'
import Game from './game'

export default {
    name : 'main',
    components : {Chat, Game}
}
</script>

<style>

</style>