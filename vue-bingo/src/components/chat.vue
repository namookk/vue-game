<template>
    <div class="chatWrap">
        <div class="chat">
          <div class="comment" v-for="(item,idx) in recvList" :key="idx" :class="{mine : item.username == username}">
            <span class="name" v-text="item.username"></span>
            <p class="text" v-text="item.content"></p>
          </div>
        </div>
        <div class="inputWrap">
          <input type="text"  v-model="content" @keyup="sendMessageEnter">
          <button type="button" @click="sendMessage">전송</button>
        </div>
    </div>
</template>

<script>
import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client'
export default {
    name : 'chat',
    props:['stomp_client'],
    data() {
        return {
            username : this.$store.getters.USER.userName,
            user : this.$store.getters.USER,
            stompClient : {},
            content : "",
            recvList : [],
            gameNo : this.$route.query.gameNo
        }
    },
    watch : {
        stomp_client () {
            if(this.$props.stomp_client && this.$props.stomp_client.connected){
                this.stompClient = this.$props.stomp_client;
                this.connect();
            }
        }
    },
    methods : {
        logout () {
            this.$http.get(this.$store.getters.SERVER_URL+"/api/game/leave")
                .then(res =>{
                    
                })
        },
        sendMessage(e) {
            if(this.username !== '' && this.content !== ''){
                this.send()
                this.content = ''
            }
        },
        sendMessageEnter(e) {
            if(e.keyCode === 13 && this.username !== '' && this.content !== ''){
                this.send()
                this.content = ''
            }
        },
        send () {
            console.log("Send message : " + this.content);
            if(this.stompClient && this.stompClient.connected){
                const msg = {
                    username : this.username,
                    content : this.content
                }
                this.stompClient.send("/chat/message", JSON.stringify(msg), {})
            }
        },
        connect() {
            const $this = this;
            //이미 연결이 되었다면 연결 안함.
            if(!(this.stompClient && this.stompClient.connected)){
                this.$emit("reconnect");
            }else{
                this.chatSubscribe();
            }
        },
        chatSubscribe(){
            console.log("chat:sub call");
            // 서버의 메시지 전송 endpoint를 구독합니다.
            // 이런형태를 pub sub 구조라고 합니다.
            this.stompClient.subscribe("/sub/chat/room", res => {
                console.log('구독으로 받은 메시지 입니다.', res.body);

                // 받은 데이터를 json으로 파싱하고 리스트에 넣어줍니다.
                let data = JSON.parse(res.body);
                let obj = {};
                let message = '';

                if(data.messageType != null){
                    if(data.messageType == 'ENTER'){
                        $('.chat').append('<p class="chatAlarm">'+data.username+'님이 입장하였습니다.</p>');
                    }else if(data.messageType == 'LEAVE'){
                        $('.chat').append('<p class="chatAlarm">'+data.username+'님이 퇴장하였습니다.</p>');
                    }
                }else{
                    obj.message = message;
                    this.recvList.push(data)
                }
            });
            this.stompClient.send("/chat/alarm", JSON.stringify({"messageType" : 'ENTER','username':this.username}), {})   
        }
    }
}
</script>

<style>

</style>