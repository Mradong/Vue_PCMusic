<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <i class="iconfont lyd-shangyixiang"></i>
          <i class="iconfont lyd-bofang" v-if="!this.$store.state.isPlay" @click=" musicPlay">
          </i>
          <i class="iconfont lyd-zanting1" v-if="this.$store.state.isPlay" @click=" musicStop">
          </i>
          <i class="lyd-xiayixiang iconfont"></i>
        </div>
      </el-col>
      <el-col :span="1"> {{ timeNow | musicDate}}</el-col>
      <el-col :span="11">
        <div class="block">
          <el-slider
            @change="newNum"
            :show-tooltip="false"
            v-model="musicValue "></el-slider>
        </div>
        <audio style="display: none" :src="musicUrl"
               ref='songPlayer' controls="controls">
          Your browser does not support the audio tag.
        </audio>
      </el-col>
      <el-col :span="1"> {{ timeDuration | musicDate}}</el-col>
      <el-col :span="1">
        <i class="iconfont lyd-yinliang" v-if="musicVolume != 0" @click="musicVolume = 0"></i>
        <i class="iconfont lyd-jinyin" v-if="musicVolume == 0" @click="musicVolume = currentVolume"></i>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple-light">
          <div class="block music-volume">
            <el-slider v-model="musicVolume" :show-tooltip="false" @change="musicvolume"></el-slider>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light"></div>
      </el-col>

    </el-row>
  </div>

</template>

<script>
  import {mapState,mapGetters, mapMutations, mapActions} from 'vuex'

  export default {
    name: "MusicFoot",
    data() {
      return {
        timeNow: 0,
        timeDuration: 0,
        musicValue: 0,
        musicVolume:0,
        currentVolume:0,
        musicUrl:''
      }
    },
    computed: {
      ...mapState([

      ]),
      ...mapGetters([
        'watchMusicPlay'
      ]),
    },
    created: function (){
      if( JSON.parse(localStorage.getItem("musicplay")) == null){
        this.musicUrl = '';
      }
      else {
        this.musicUrl = JSON.parse(localStorage.getItem("musicplay")).url;
      }
    },
    methods: {
      _currentTime: function () {
        this.timeNow = parseInt(this.$refs.songPlayer.currentTime)
        this.changeMusicTime( this.timeNow  )
      },
      _durationTime: function () {
        this.timeDuration = parseInt(this.$refs.songPlayer.duration)
      },
      addEventListeners: function () {
        this.$refs.songPlayer.addEventListener('timeupdate', this._currentTime),
          this.$refs.songPlayer.addEventListener('canplay', this._durationTime)
      },
      removeEventListeners: function () {
        this.$refs.songPlayer.removeEventListener('timeupdate', this._currentTime)
        this.$refs.songPlayer.removeEventListener('canplay', this._durationTime)
      },
      //
      musicPlay: function () {
        this.changeIsplay(true);
        this.$refs.songPlayer.play();
      },
      musicStop: function () {
        this.changeIsplay(false);
        this.$refs.songPlayer.pause();

      },
      musicvolume( val){

        this.currentVolume = val;
        this.$refs.songPlayer.volume = val / 100;
      },
      //滑块点击控制音乐播放进度
      newNum: function (value) {
        this.$refs.songPlayer.currentTime = (value / 100) * this.timeDuration;
      },
      //vuex组件
      ...mapMutations({
        changeIsplay: 'changeIsplay',
        changeMusicTime: 'changeMusicTime',
      }),
      ...mapActions([
        // addCount
      ])
    },
    watch: {
      //监听 当前音乐播放时间，来控制滑条进度
      timeNow(newValue) {
        if(newValue == this.timeDuration){
          this.changeIsplay(false);
          this.timeNow = 0;
        }
        this.musicValue = (newValue / this.timeDuration);
        this.musicValue = this.musicValue.toFixed(3) * 100;
      },
      //监听vuex中的currentSrc数据
      watchMusicPlay(musicIfo) {
        let musicifo = JSON.parse(musicIfo);
        this.$refs.songPlayer.src = musicifo.url;
        this.musicPlay();
      },
      musicVolume( val ){
        this.$refs.songPlayer.volume = val / 100;
      }
    },
    mounted() {
      this.addEventListeners()
    },
    beforeDestroyed() {
      this.removeEventListeners()
    }
  }
</script>

<style>
  .music-volume .el-slider__runway, .music-volume .el-slider__runway .el-slider__bar{
    height: 4px;
  }
  .music-volume .el-slider__runway .el-slider__bar{
    background-color: #ff4040;
  }
  .music-volume .el-slider__runway .el-slider__button{
    width: 8px;
    height: 8px;
    border: 3px solid #eeecffeb;
    background-color: #ff4040;
  }
</style>

<style scoped>

  .el-row div:nth-child(2) {
    margin-top: 8px;
    padding-right: 50px;
  }

  .el-row div:nth-child(4) {
    margin-top: 8px;
    padding-left: 15px;
  }

  .grid-content {
    margin-left: 15px;
  }

  .lyd-bofang, .lyd-zanting1, .lyd-shangyixiang, .lyd-xiayixiang{
    font-size: 28px;
    color: #d31515e0;
    cursor: pointer;
  }
  .lyd-yinliang, .lyd-jinyin{
    padding-left: 20px;
    font-size: 16px;
    position: relative;
    top: 7px;
    left: 10px;
  }
</style>
