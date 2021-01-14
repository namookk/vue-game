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
import router from '../router/index'
export default {
    name : 'login',
    data () {
         return {
             username : ''
         }
    },
    mounted() {
      if(window.Notification){
        Notification.requestPermission();
      }
    },
    methods : {
        goMain () {
            const $this = this;
            this.$http.get(this.$store.getters.SERVER_URL+'/api/game/enter',{
              params : {"username":this.username}
            }).then(res => {
               if(res.data.obj < 2){
                  
                  $this.$store.commit('login',res.data.obj2);
                  router.push({name  : "Main",query : {"gameNo":res.data.obj2.enterGameNo}});
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