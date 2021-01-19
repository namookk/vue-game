<template>
   <div id="main" class="wrap">
    <div class="container">
      <Game :stomp_client="stomp_client" v-on:reconnect="connect"/>
      <Chat :stomp_client="stomp_client" v-on:reconnect="connect"/>
      <button type="button" class="exitBtn" @click="disconnect">나가기</button>
    </div>
   </div>
</template>

<script>
import Chat from './chat.vue'
import Game from './game'
import Stomp from 'webstomp-client'
import SockJS from "sockjs-client"
import router from '../router/index'

export default {
    name : 'main',
    components : {Chat, Game},
    data () {
      return {
        stomp_client  : {},
        temp_stomp_client : {}
      }
    },
    created() {
       this.connect();
    },
    mounted(){
    },
    methods : {
      connect (state) {
             //const serverURL = "http://54.180.210.229:9999"
             const serverURL = this.$store.getters.SERVER_URL;
             let socket = new SockJS(serverURL)
             this.temp_stomp_client = Stomp.over(socket)
             console.log("소켓 연결을 시도합니다. 서버 주소 : ${serverURL}")
             this.temp_stomp_client.connect(
                 {},
                 frame => {
                    // 소켓 연결 성공
                    this.temp_stomp_client.connected = true;
                    console.log('소켓 연결 성공', frame);
                    this.stomp_client = this.temp_stomp_client;
                 },
                 error => {
                    // 소켓 연결 실패
                    console.log('소켓 연결 실패', error);
                    this.temp_stomp_client.connected = false;
                     this.stomp_client = this.temp_stomp_client;
                 }
             );
        },
        disconnect () {
          if(confirm("정말로 게임에서 나가시겠습니까?")){
            const $this = this;
            const data = {
              params : {
                "userIdStr":$this.$store.getters.USER.userId,
                "userName" : $this.$store.getters.USER.userName,
                "enterGameNo" : $this.$store.getters.USER.enterGameNo
              }
            }      
  
            this.$http.get(this.$store.getters.SERVER_URL+'/api/game/leave',data)
            .then(res => {
               if(res.data.obj){
                  $this.stomp_client.disconnect()
                  $this.$store.commit("logout");
                  $this.stomp_client = {}
                  $this.temp_stomp_client = {}
                  router.push({name  : "Login"});
               }
            })


          }
        }
    }
    
    
}
</script>

<style>

</style>