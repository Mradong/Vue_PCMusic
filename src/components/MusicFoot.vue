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
      <el-col :span="12">
        <div class="block">
          <el-slider
            @change="newNum"
            v-model="musicValue "></el-slider>
        </div>
        <audio style="display: none" :src="musicUrl"
               ref='songPlayer' controls="controls">
          Your browser does not support the audio tag.
        </audio>
      </el-col>
      <el-col :span="1"> {{ timeDuration | musicDate}}</el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light"></div>
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
      //监听H5音乐播放事件，获取数据
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

    },
    mounted() {
      this.addEventListeners()
    },
    beforeDestroyed() {
      this.removeEventListeners()
    }
  }
</script>

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

  .lyd-bofang, .lyd-zanting1, .lyd-shangyixiang, .lyd-xiayixiang {
    font-size: 28px;
    color: #d31515e0;
    cursor: pointer;
  }
</style>
