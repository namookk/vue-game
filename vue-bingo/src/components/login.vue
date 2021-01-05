<template>
  <div id="login" class="wrap">
    <div class="userWrap">
      <input type="text" v-model="username">
      <button type="button" @click="goMain">시작</button>
    </div>
  </div>
</template>

<script>
export default {
    name : 'login',
    data () {
         return {
             username : ''
         }
    },
    methods : {
        goMain () {
            this.$store.commit('login',this.username)
            location.href= "/main"
        }
    }
}
</script>

<style>

</style>