<template>
    <div class="chatWrap">
        <div class="chat">
            <p v-for="(item,idx) in recvList" :key="idx"><span class="name">{{item.username}}</span> : <span class="contents">{{item.content}}</span></p>
        </div>
        <div class="inputWrap">
            <input type="text" v-model="content" @keyup="sendMessageEnter">
            <button type="button" @click="sendMessage">보내기</button>
        </div>
    </div>
</template>

<script>
import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client'
export default {
    name : 'chat',
    data() {
        return {
            username : this.$store.getters.USERNAME,
            content : "",
            recvList : []
        }
    },
    created() {
        this.connect()
    },
    methods : {
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
                this.stompClient.send("/receive", JSON.stringify(msg), {})
            }
        },
        connect() {
            const serverURL = "http://192.168.11.209:9999"
            let socket = new SockJS(serverURL)
            this.stompClient = Stomp.over(socket)
            console.log("소켓 연결을 시도합니다. 서버 주소 : ${serverURL}")
            this.stompClient.connect(
                {},
                frame => {
                // 소켓 연결 성공
                this.connected = true;
                console.log('소켓 연결 성공', frame);
                // 서버의 메시지 전송 endpoint를 구독합니다.
                // 이런형태를 pub sub 구조라고 합니다.
                this.stompClient.subscribe("/send", res => {
                    console.log('구독으로 받은 메시지 입니다.', res.body);

                    // 받은 데이터를 json으로 파싱하고 리스트에 넣어줍니다.
                    let data = JSON.parse(res.body);
                    if(data.username === this.username){
                        data.username = '나';
                    }
                    this.recvList.push(data)

                });
                },
                error => {
                // 소켓 연결 실패
                console.log('소켓 연결 실패', error);
                this.connected = false;
                }
            );     
        }
    }
}
</script>

<style>

</style>