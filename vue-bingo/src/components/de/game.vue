<template>
  <div class="stepWrap">
    <div class="step step1" :class="{on : stepNo == 1}">
      <button type="button" class="readyBtn" 
        @click="doReady" 
        :class="{off : ready, disable : numofpeople < 2}">준비</button>
      <p class="statusBar" :class="{off : (numofpeople < 2 || !ready || oppoReady)}"><span class="text">상대편이 준비 중입니다</span><span class="waiting">...</span></p>
      <p class="statusBar" :class="{off : !gameStart}"><span v-text="gameTimer"></span>초후 시작됩니다.</p>
    </div>
    <div class="step step2" :class="{on : stepNo == 2}">
      <ul class="subject">
        <li><span>영화 제목</span></li>
        <li><span>(4발 달린) 동물</span></li>
        <li><span>국가 이름</span></li>
        <li><span>아이돌 그룹</span></li>
        <li><span>남자 배우</span></li>
        <li><span>캐릭터 이름</span></li>
        <li><span>만화제목</span></li>
        <li><span>자바스크립트 메서드</span></li>
        <li><span>과자 이름</span></li>
        <li><span>아이스크림 이름</span></li>
      </ul>
    </div>
    <div class="step step3" :class="{on : stepNo == 3}">
      <h2>주제</h2>
      <table class="bingo">
        <colgroup>
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
        </colgroup>
        <tbody>
          <tr>
            <td class="chk sucess"><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td class="sucess"><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td class="sucess"><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td class="sucess"><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td class="sucess"><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
          </tr>
          <tr>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
          </tr>
          <tr>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
          </tr>
          <tr>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
          </tr>
          <tr>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
            <td><textarea onkeydown="resize(this)" onkeyup="resize(this)"></textarea></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="exitPopWrap">
      <div class="exitPop">
        <p>정말 나가시겠습니까?</p>
        <button type="button" title="나가기">확인</button>
        <button type="button" title="나가기 취소">취소</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
    name : 'game',
    props : ['stomp_client'],
    data () {
      return {
        username : this.$store.getters.USER.userName,
        user : this.$store.getters.USER,
        ready : false,
        oppoReady : false,
        numofpeople : 0,
        stompClient : {},
        gameNo : this.$route.query.gameNo,
        stepNo : 1,
        gameTimer : 5,
        gameStart : false,
        step2LiList : null
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
    methods: {
      connect() {
        const $this = this;
        //이미 연결이 되었다면 연결 안함.
        if(!(this.stompClient && this.stompClient.connected)){
            this.$emit("reconnect");
        }else{
            this.gameSubscribe();
        }
      },
      gameSubscribe () {
        //인원수 조회
        const $this = this;

        //게임 인원수 조회
        this.stompClient.subscribe("/sub/game/people/"+$this.gameNo, res => {
          let data = JSON.parse(res.body);
          $this.numofpeople = data;
        });

        //게임 상태
        this.stompClient.subscribe("/sub/game/status/"+$this.gameNo, res => {
          let data = JSON.parse(res.body);
          if(data.length < 2){
            this.reset();
          }
          data.forEach(element => {
            if(element.user.userId != $this.user.userId){
              $this.oppoReady = element.readyfl;
            }
          });
        });

        //게임 스타트
        this.stompClient.subscribe("/sub/game/start/"+$this.gameNo, res => {
          if(res.body){
            $this.gameStart = true;
            let timer = setInterval(function(){
              if($this.gameTimer == 1){
                $this.stepNo = 2;
                $this.step2_pop();
                clearInterval(timer);
              } 
              $this.gameTimer--;
            },1000)
          }
        });
      },
      doReady() {
        if(this.numofpeople < 2) return; 
        this.ready = !this.ready;

        if(this.stompClient && this.stompClient.connected){
              const msg = {
                  userId : this.user.userId,
                  gameNo : this.gameNo,
                  ready : this.ready
              }
              this.stompClient.send("/game/ready", JSON.stringify(msg), {})
          }
      },
      reset(){
        this.ready = false;
        this.oppoReady = false;
        
      },
      step2_pop() {
        const $this = this;
        this.step2LiList = document.querySelectorAll(".step2 .subject li");
        for(let i = 0; i < this.step2LiList.length;i++){
          $this.step2_pop_time(i);
        }
      },
      step2_pop_time (idx) {
        const $this = this;
        setTimeout(function(){
          $this.step2LiList[idx].classList.add("on")
        },300 * (idx + 1))
      }
    }
}
</script>

<style>

</style>