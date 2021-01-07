<template>
  <div id="login" class="wrap">
     <h1>BINGO</h1>
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
            this.$http.get('http://54.180.210.229:9999/api/game/enter')
            .then(res => {
               if(res.data.obj < 2){
                  this.$store.commit('login',this.username)
                  location.href= "/main"
               }else{
                  alert("인원이 가득찼습니다.");
               }
            })
        }
    }
}
</script>

<style>

</style>