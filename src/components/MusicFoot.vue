<template>
  <div>
    <el-row class="play-detail">
      <el-col :span="4" >
        <div class="grid-content bg-purple " v-if="musicType =='mp3'">
          <i class="iconfont lyd-shangyixiang" @click="cutUpMusic"></i>
          <i class="iconfont lyd-bofang" v-if="!isPlay" @click=" musicPlay"></i>
          <i class="iconfont lyd-zanting1" v-if="isPlay" @click=" musicStop"></i>
          <i class="lyd-xiayixiang iconfont" @click="cutDownMusic"></i>
        </div>
        <div class="grid-content bg-purple fm-status-bar" v-if="musicType == 'fm'">
          <i class="iconfont lyd-bofang" v-if="!isPlay" @click=" musicPlay"></i>
          <i class="iconfont lyd-zanting1" v-if="isPlay" @click=" musicStop"></i>
          <i class="lyd-xiayixiang iconfont" @click="cutDownFM"></i>
        </div>
      </el-col>
      <el-col :span="1"> {{ timeNow | musicDate}}</el-col>
      <el-col :span="11" v-if="musicType =='mp3'">
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
      <el-col :span="12" v-if="musicType == 'fm'">
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

        <div class="fr fm-last-iconbox" v-if="musicType =='fm'" >
          <i class="lyd-gecitiaozheng iconfont"></i>
        </div>

      <div class="fr last-iconbox" v-if="musicType =='mp3'">
        <i class="lyd-liebiaoxunhuan iconfont" v-if="playOrder == 0" @click="changesPlayOrder"></i>
        <i class="lyd-danquxunhuan iconfont" v-if="playOrder == 1" @click="changesPlayOrder"></i>
        <i class="lyd-suiji iconfont" v-if="playOrder == 2" @click="changesPlayOrder"></i>
        <i class="lyd-shunxubofang iconfont" v-if="playOrder == 3" @click="changesPlayOrder"></i>
        <i class="lyd-gecitiaozheng iconfont"></i>
        <div class="fr music-plist" v-if="musicType =='mp3'">
          <el-popover
            placement="top"
            width="570"
            show-header
            popper-class="music-play-plist"
            :visible-arrow="false"
            stripe
            trigger="click">
            <div v-if=" musicPlayList.length != 0">
              <div class="music-plist-header">
                <el-row>
                  <el-col :span="24" class="music-plist-header-title">
                    <div>播放列表</div>
                  </el-col>
                  <el-col :span="2">
                    <div>&emsp;&emsp;&emsp;</div>
                  </el-col>
                  <el-col :span="14">
                    总{{ musicPlayList.length }}首
                  </el-col>
                  <el-col :span="4">
                    <i class="el-icon-circle-plus-outline" style="margin-right: 5px"></i>收藏全部
                  </el-col>
                  <el-col :span="3" style="margin-left: 22px">
                    <span @click="clearPlayList"><i class="el-icon-delete" style="margin-right: 3px"></i>清空</span>
                  </el-col>
                </el-row>
              </div>
              <div class="music-plist-form">
                <el-row v-for=" (item,index) in musicPlayList" :key="index" @dblclick.native="cutMusic(index)">
                  <el-col :span="2" v-if="index != musicIndex">
                    <div>&emsp;</div>
                  </el-col>
                  <el-col :span="2" v-if="index == musicIndex">
                    <i class="iconfont lyd-diantaibofangye_bofang" v-if="!isPlay" @click=" musicPlay"></i>
                    <i class="iconfont lyd-diantaibofangye_zanting" v-if="isPlay" @click=" musicStop"></i>
                  </el-col>
                  <el-col :span="11">
                    {{item.name | hanziLimit(18)}}
                  </el-col>
                  <el-col :span="7">
                    {{item.singer | hanziLimit(10)}}
                  </el-col>
                  <el-col :span="2">
                    {{item.time}}
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if=" musicPlayList.length == 0">
              <div class="music-plist-header">
                <el-row>
                  <el-col :span="24" class="music-plist-header-title">
                    <div>播放列表</div>
                  </el-col>
                  <el-col :span="2">
                    <div>&emsp;&emsp;&emsp;</div>
                  </el-col>
                  <el-col :span="14">
                    总{{ musicPlayList.length }}首
                  </el-col>
                  <el-col :span="4">
                    <i class="el-icon-circle-plus-outline" style="margin-right: 5px"></i>收藏全部
                  </el-col>
                  <el-col :span="3" style="margin-left: 22px">
                    <i class="el-icon-delete" style="margin-right: 3px"></i>清空
                  </el-col>
                </el-row>
              </div>
              <div class="music-plist-form">
                <div style="margin: 150px  250px"> 请添加歌曲</div>
              </div>
            </div>
            <el-button class="music-plist-button" icon="lyd-plist iconfont" slot="reference">{{ musicPlayList.length
              }}
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
        playOrder: 0,//0列表循环、1单曲循环、2随机播放、3、顺序播放
        musicPlayList: [],
        musicIndex: null,
      }
    },
    computed: {
      ...mapState([
        'isPlay',
        'musicList',
        'musicType',
        'FMIndex',
        'FMsLength'
      ]),
      ...mapGetters([
        'watchMusicPlay',
      ]),
    },
    created: function () {
      if (JSON.parse(localStorage.getItem("musicplay")) == null) {
        this.musicUrl = '';
      } else {
        let musicIfo = JSON.parse(localStorage.getItem("musicplay"));
        this.musicUrl = musicIfo.url;
        if (JSON.parse(localStorage.getItem('musicIndex')) != null) {
          this.musicIndex = JSON.parse(localStorage.getItem('musicIndex'));
        }
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
      if (JSON.parse(localStorage.getItem("musicPlayList")) != null) {
        this.musicPlayList = JSON.parse(localStorage.getItem('musicPlayList'));
      }
      if (JSON.parse(localStorage.getItem('playOrder')) != null) {
        this.playOrder = JSON.parse(localStorage.getItem('playOrder'));
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
      cutDownFM(){
        if (this.FMIndex == (this.FMsLength - 1)) {
          this.changeFMsLength(-1)
        }
        this.changeFMIndex(this.FMsLength - 1);
        this.changeIsMenus(false);
        this.$nextTick(function () {
          this.changeIsMenus(true);
        })
      },
      cutMusic(index) {
        localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[index]));
        this.changemusicPlay();
      },
      cutUpMusic() {
        this.changeIsplay(false);
        this.timeNow = 0;
        if (this.musicPlayList.length == 1) {
          setTimeout(() => {
            this.musicPlay();
          }, 400)
        } else {
          if (this.musicIndex == 0) {
            this.$refs.songPlayer.src = this.musicPlayList[this.musicPlayList.length - 1].url;
            localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[this.musicPlayList.length - 1]));
            this.musicIndex = this.musicPlayList.length - 1;
          } else {
            if (this.playOrder == 2) {
              let random = Math.floor(Math.random() * (this.musicPlayList.length - 1));
              this.$refs.songPlayer.src = this.musicPlayList[random].url;
              localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[random]));
              this.musicIndex = random;
            } else {
              this.$refs.songPlayer.src = this.musicPlayList[this.musicIndex - 1].url;
              localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[this.musicIndex - 1]));
              this.musicIndex = this.musicIndex - 1;
            }
          }
          this.changemusicPlay();
        }
      },
      cutDownMusic() {
        this.changeIsplay(false);
        this.timeNow = 0;
        if (this.musicPlayList.length == 1) {
          setTimeout(() => {
            this.musicPlay();
          }, 400)
        } else {
          if (this.musicIndex == this.musicPlayList.length - 1) {
            this.$refs.songPlayer.src = this.musicPlayList[0].url;
            localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[0]));
            this.musicIndex = 0;
          } else {
            if (this.playOrder == 2) {
              let random = Math.floor(Math.random() * (this.musicPlayList.length - 1));
              this.$refs.songPlayer.src = this.musicPlayList[random].url;
              localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[random]));
              this.musicIndex = random;
            } else {
              this.$refs.songPlayer.src = this.musicPlayList[this.musicIndex + 1].url;
              localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[this.musicIndex + 1]));
              this.musicIndex = this.musicIndex + 1;
            }

          }
          this.changemusicPlay();
        }
      },
      clearPlayList() {
        this.musicPlayList = [];
        localStorage.removeItem("musicplay");
        localStorage.removeItem("musicPlayList");
        this.$refs.songPlayer.src = '';
        this.timeDuration = 0;
        this.changemusicPlay();
      },
      changesPlayOrder() {
        if (this.playOrder < 3) {
          this.playOrder++;
        } else {
          this.playOrder = 0;
        }
        localStorage.setItem("playOrder", JSON.stringify(this.playOrder));
      },
      //滑块点击控制音乐播放进度
      newNum: function (value) {
        this.$refs.songPlayer.currentTime = (value / 100) * this.timeDuration;
      },
      playMode() {
        switch (this.playOrder) {
          case 0 :
            if (this.musicPlayList.length == 1) {
              setTimeout(() => {
                this.musicPlay();
              }, 400)
            } else {
              if (this.musicIndex == this.musicPlayList.length - 1) {
                this.$refs.songPlayer.src = this.musicPlayList[0].url;
                localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[0]));
                this.musicIndex = 0;
              } else {
                this.$refs.songPlayer.src = this.musicPlayList[this.musicIndex + 1].url;
                localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[this.musicIndex + 1]));
                this.musicIndex = this.musicIndex + 1;
              }
              this.changemusicPlay();
            }
            break;
          case 1:
            setTimeout(() => {
              this.musicPlay();
            }, 400)

            break;
          case 2:
            if (this.musicPlayList.length == 1) {
              setTimeout(() => {
                this.musicPlay();
              }, 400)
            } else {
              let random = Math.floor(Math.random() * (this.musicPlayList.length - 1));
              this.$refs.songPlayer.src = this.musicPlayList[random].url;
              localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[random]));
              this.musicIndex = random;
            }
            this.changemusicPlay();

            break;
          case 3:
            if (this.musicIndex == this.musicPlayList.length - 1) {
              this.$refs.songPlayer.src = this.musicPlayList[0].url;
              localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[0]));
              this.musicIndex = 0;
              this.changemusicPlay();
              this.musicStop();
            } else {
              this.$refs.songPlayer.src = this.musicPlayList[this.musicIndex + 1].url;
              localStorage.setItem("musicplay", JSON.stringify(this.musicPlayList[this.musicIndex + 1]));
              this.musicIndex = this.musicIndex + 1;
            }

            break;
          default:
            break;
        }
      },
      ...mapMutations({
        changeIsplay: 'changeIsplay',
        changeMusicTime: 'changeMusicTime',
        changemusicPlay: 'changemusicPlay',
        changeIsMenus:'changeIsMenus',
        changeFMsLength:'changeFMsLength',
        changeFMIndex:'changeFMIndex',

      }),
      ...mapActions([
        // addCount
      ])
    },
    watch: {
      //监听 当前音乐播放时间，来控制滑条进度
      timeNow(newValue) {
        if (newValue == this.timeDuration) {
          this.changeIsplay(false);
          this.timeNow = 0;
          this.playMode();
        }
        this.musicValue = (newValue / this.timeDuration);
        this.musicValue = this.musicValue.toFixed(3) * 100;

      },
      //监听vuex中的音乐信息数据
      watchMusicPlay(musicIfo) {
        let musicifo = JSON.parse(musicIfo);
        this.$refs.songPlayer.src = musicifo.url;
        this.musicPlay();
        if (JSON.parse(localStorage.getItem("musicPlayList")) == null) {
          this.musicPlayList.push(musicifo);
          localStorage.setItem("musicPlayList", JSON.stringify(this.musicPlayList));
        } else {
          this.musicPlayList = JSON.parse(localStorage.getItem('musicPlayList'));
          let musicPlayListLen = this.musicPlayList.length;
          let status = true;
          for (let i = 0; i < musicPlayListLen; i++) {
            if (this.musicPlayList[i].id == musicifo.id) {
              status = false;
            }
          }
          if (status == true) {
            this.musicPlayList.push(musicifo);
            localStorage.setItem("musicPlayList", JSON.stringify(this.musicPlayList));
          }
          this.musicIndex = this.musicPlayList.findIndex(fruit => fruit.id === musicifo.id);
        }
        localStorage.setItem("musicIndex", JSON.stringify(this.musicIndex));
      },
      musicVolume(val) {
        this.$refs.songPlayer.volume = val / 100;
      },
      musicList(val) {
        this.musicPlayList = val;
      },
      isPlay( playStatus ){
        if ( playStatus == false) {
          this.musicStop();
        }
        else {
          this.musicPlay();
        }
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

  .music-plist .el-button:hover {
    color: #606266;
    border-color: rgba(201, 201, 201, 0.25);
    outline: 0;
  }

  .music-plist .el-button:active {
    color: #606266;
    border-color: rgba(201, 201, 201, 0.25);
    outline: 0;
  }

  .music-play-plist {
    top: 203px !important;
    left: 870px !important;
    /*box-shadow: none !important;*/
    height: 430px;
    padding: 0 !important;
  }

  .el-row .last-iconbox div.music-plist .music-plist-button i.lyd-plist {
    position: relative;
    left: -4px;
  }

  .el-row .last-iconbox div.music-plist .music-plist-button span {
    font-size: 14px;
    margin: 0;
  }

  .music-plist-form .el-row {
    line-height: 28px;
    height: 32px;
    margin-top: 4px;
  }

  div.music-plist-form > div:nth-child(odd) {
    background-color: #fff;
  }

  div.music-plist-form > div:nth-child(even) {
    background-color: rgba(212, 212, 212, 0.28);
  }

  .music-plist-header .el-row .el-col {
    height: 35px;
    line-height: 35px;
  }
</style>

<style scoped lang="less">

  .play-detail{
    .grid-content {
      margin-left: 15px;
    }
    .fm-status-bar{
      padding-left: 20px;
    }
  }

  .play-detail div:nth-child(2) {
    margin-top: 8px;
    padding-right: 50px;
  }

  .play-detail div:nth-child(4) {
    margin-top: 8px;
    padding-left: 15px;
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
  .fm-last-iconbox{
    width: 56px;
    margin: 5px auto;
  }
  .last-iconbox i ,.fm-last-iconbox i{
    padding: 0 2px;
    font-size: 18px;
  }

  .el-row .last-iconbox div.music-plist .music-plist-button {
    padding: 0;
    margin: 0;
    width: 46px;
    height: 16px;
    position: relative;
    top: 4px;
    background-color: rgba(201, 201, 201, 0.25);
  }

  .music-plist-header {
    border-bottom: 1px solid rgba(6, 12, 6, 0.12);
  }

  .music-plist-form {
    overflow: auto;
    height: 345px;
  }

  .music-plist-form::-webkit-scrollbar { /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  .music-plist-form::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 10px;
    background: rgba(203, 0, 0, 0.27);
  }

  .music-plist-form::-webkit-scrollbar-track { /*滚动条里面轨道*/
    background: #EDEDED;
  }

  .music-plist-header .el-row .music-plist-header-title {
    height: 50px;
    background: rgba(197, 197, 197, 0.29);
    border-bottom: 1px solid rgba(6, 12, 6, 0.12);
  }

  .music-plist-header-title div {
    margin: 12.5px auto;
    width: 100px;
    height: 20px;
    background-color: #0086b3;
    text-align: center;
    line-height: 20px;
    color: #fff;
  }

  i.iconfont.lyd-diantaibofangye_zanting, i.iconfont.lyd-diantaibofangye_bofang {
    font-size: 28px;
    margin-left: 10px;
    color: #ee3c07f2;
  }

</style>
