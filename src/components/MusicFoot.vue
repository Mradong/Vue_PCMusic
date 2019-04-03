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
      <div class="fr last-iconbox">
        <i class="lyd-liebiaoxunhuan iconfont" v-if="playOrder == 0" @click="playOrder++"></i>
        <i class="lyd-danquxunhuan iconfont" v-if="playOrder == 1" @click="playOrder++"></i>
        <i class="lyd-suiji iconfont" v-if="playOrder == 2" @click="playOrder++"></i>
        <i class="lyd-shunxubofang iconfont" v-if="playOrder == 3" @click="playOrder=0"></i>

        <i class="lyd-gecitiaozheng iconfont"></i>
        <div class="fr music-plist">
          <el-popover
            placement="top"
            width="570"
            show-header
            popper-class="music-play-plist"
            :visible-arrow="false"
            stripe
            trigger="click">

            <template>
              <el-table
                :data="musicPlayList"
                style="width: 100%">
                <el-table-column
                  label="日期"
                  width="180">
                  <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="姓名"
                  width="180">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>姓名: {{ scope.row.name }}</p>
                      <p>住址: {{ scope.row.address }}</p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.name }}</el-tag>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  sortable
                  width="250"
                  label="音乐标题"
                  prop="name">
                </el-table-column>
              </el-table>
            </template>

            <el-button class="lyd-plist iconfont " slot="reference">
              20
            </el-button>
          </el-popover>
        </div>
      </div>
    </el-row>
  </div>

</template>

<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

  export default {
    name: "MusicFoot",
    data() {
      return {
        timeNow: 0,
        timeDuration: 0,
        musicValue: 0,
        musicVolume: 50,
        currentVolume: 0,
        musicUrl: '',
        playOrder:0,//0列表循环、1单曲循环、2随机播放、3、顺序播放
        musicPlayList:[],
      }
    },
    computed: {
      ...mapState([]),
      ...mapGetters([
        'watchMusicPlay'
      ]),
    },
    created: function () {
      if (JSON.parse(localStorage.getItem("musicplay")) == null) {
        this.musicUrl = '';
      } else {
        let musicIfo = JSON.parse(localStorage.getItem("musicplay"));
        this.musicUrl = musicIfo.url;
        this.musicPlayList = JSON.parse(localStorage.getItem('musicPlayList'));
        let parseMusicPlayList = this.musicPlayList.map(item =>{
          return JSON.parse(item )
        })

        this.musicPlayList = parseMusicPlayList ;
        if (this.timeNow != 0) {
          if (musicIfo.hasOwnProperty("volume")) {
            this.$refs.songPlayer.volume = musicIfo.volume / 100;
            this.musicVolume = musicIfo.volume;
          } else {
            this.$refs.songPlayer.volume = this.musicVolume / 100;
          }
        } else {
          if (musicIfo.hasOwnProperty("volume")) {
            this.musicVolume = musicIfo.volume;
          }
        }
      }

    },
    methods: {
      _currentTime: function () {
        this.timeNow = parseInt(this.$refs.songPlayer.currentTime)
        this.changeMusicTime(this.timeNow)
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
        this.$refs.songPlayer.volume = this.musicVolume / 100;
      },
      musicStop: function () {
        this.changeIsplay(false);
        this.$refs.songPlayer.pause();
      },
      musicvolume(val) {
        this.currentVolume = val;
        this.$refs.songPlayer.volume = val / 100;
        let musicIfo = JSON.parse(localStorage.getItem('musicplay'));
        musicIfo.volume = val;
        localStorage.setItem("musicplay", JSON.stringify(musicIfo));
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
        if (newValue == this.timeDuration) {
            switch (this.playOrder) {
              case 0 :
                console.log( '0')
                break;
              case 1:
                this.changeIsplay(false);
                this.timeNow = 0;
                setTimeout(()=>{
                  this.musicPlay();
                },200)
                break;
              case 2:
                console.log( '2')
                break;
              case 3:
                console.log( '3')
                break;
              default:
                break;
            }
        }
        this.musicValue = (newValue / this.timeDuration);
        this.musicValue = this.musicValue.toFixed(3) * 100;

      },
      //监听vuex中的音乐信息数据

      watchMusicPlay(musicIfo,oldMusicIfo ) {
        let musicifo = JSON.parse(musicIfo);
        this.$refs.songPlayer.src = musicifo.url;
        this.musicPlay();
        this.musicPlayList.push(musicIfo )
        let musicPlayList = new Set(this.musicPlayList)
        localStorage.setItem("musicPlayList", JSON.stringify(musicPlayList));
      },
      musicVolume(val) {
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

  .music-volume .el-slider__runway, .music-volume .el-slider__runway .el-slider__bar {
    height: 4px;
  }

  .music-volume .el-slider__runway .el-slider__bar {
    background-color: #ff4040;
  }

  .music-volume .el-slider__runway .el-slider__button {
    width: 8px;
    height: 8px;
    border: 3px solid #eeecffeb;
    background-color: #ff4040;
  }

  .music-play-plist {
    top: 179px !important;
    left: 849px !important;
    box-shadow: none !important;
    height: 430px;
  }

  .el-row .last-iconbox div.music-plist .lyd-plist span {
    font-size: 12px;
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

  .lyd-bofang, .lyd-zanting1, .lyd-shangyixiang, .lyd-xiayixiang {
    font-size: 28px;
    color: #d31515e0;
    cursor: pointer;
    margin: 0 5px;
  }

  .lyd-yinliang, .lyd-jinyin {
    padding-left: 20px;
    font-size: 16px;
    position: relative;
    top: 7px;
    left: 10px;
  }

  .last-iconbox {
    width: 98px;
    margin: 5px 10px;

  }

  .last-iconbox i {
    padding: 0 2px;
    font-size: 18px;
  }

  .el-row .last-iconbox div.music-plist {
    padding: 0;
    margin: 0;
    width: 16px;
    height: 16px;
    position: relative;
    top: 4px;
    padding-left: 6px;
  }

  .el-row .last-iconbox div.music-plist .lyd-plist {
    position: absolute;
    top: 0;
    left: -15px;
    z-index: 10;
    padding: 0;
    font-size: 16px;
    background-color: rgba(189, 189, 189, 0.32);
    color: #000000;
  }

</style>
