<template>
  <div class="per-fm">
    <div class="fm-details">
      <div class="fm-cover">
        <img :src="FM.pic+'?param=300y300'" alt="">
        <i class="lyd-bofang2 iconfont" @click="FMPlay" v-if="!isFMPlay"></i>
        <i class="lyd-zanting2 iconfont" @click="FMStop" v-if="isFMPlay"></i>
        <div class="fm-operate">
          <i class="lyd-qunfengcainixihuanxian iconfont"></i>
          <i class="lyd-tubiaolunkuo- iconfont"></i>
          <i @click="cutFM" class="lyd-xiayige iconfont"></i>
          <i class="lyd-shenglve iconfont"></i>
        </div>
      </div>
      <div class="fm-detail">
        <h1>{{ FM.name}}</h1>
        <div>
          专辑：<span>{{FM.album}}</span>
          歌手：<span>{{FM.singer}}</span>
        </div>
        <div class="lyrics" ref="lyrics">
          <ul class="lyrics-box" ref="lyricsBox" id="lyrics">
            <li v-for=" item,index in FMLyricList" :key=" index" v-bind:class="{ on:index==currentLrc}">{{ item}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div style="clear:both;"></div>
    <div class="music-play-bottom">
      <div class="song-reviews">
        <div class="user-ratings">
          <div class="music-user">听友评论</div>
          <el-input
            prefix-icon="el-icon-edit"
            placeholder="发表评论"
          >
          </el-input>
        </div>
        <ul class="brilliant">
          <h4>精彩评论</h4>
          <li class="fl" v-for="item,index in hotComments " :key="index">
            <div class="fl brilliant-img">
              <img :src="item.user.avatarUrl+'?param=40y40'" alt="">
            </div>
            <div class="fl brilliant-content">
              <span>{{ item.user.nickname}}</span>
              <span>:</span> {{item.content }}
              <div><span>{{ item.time | convertDate }}</span></div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "MUsicPersonalFM",
    data() {
      return {
        FM: [],
        FMs: [],
        FMLyricTime: '',
        FMLyricList: '',
        hotComments: [],
        currentLrc: null,
        endTime: null,
        isOver: true,
        isFMPlay:false,
      };
    },
    computed: {
      ...mapState([
        'musicTime',
        'musicPlay',
        'FMIndex',
        'FMsLength',
        'isPlay'
      ]),
    },
    methods: {
      ...mapMutations({
        changeIsMenus: 'changeIsMenus',
        changemusicPlay: 'changemusicPlay',
        changeFMIndex: 'changeFMIndex',
        changeFMsLength: 'changeFMsLength',
        changeMusicList: 'changeMusicList',
        changeIsFM: 'changeIsFM',
        changeIsplay:'changeIsplay',
      }),
      FMPlay() {
        let musicInfo = JSON.parse(localStorage.getItem("musicplay"));
        if ( musicInfo.type =='mp3') {
          localStorage.removeItem("musicPlayList");
          localStorage.setItem("musicPlayList", JSON.stringify(this.FMs));
          this.changeMusicList();
        }
        this.changeIsplay(true);
        localStorage.removeItem("musicplay");
        localStorage.setItem("musicplay", JSON.stringify(this.FM));
        this.changemusicPlay();
        this.isFMPlay = true;
        if( this.$route.name == 'fm'){
          this.changeIsFM(false);
        }
      },
      FMStop(){
        this.changeIsplay(false);
        this.isFMPlay = false;
      },
      cutFM() {
        if (this.FMIndex == (this.FMsLength - 1)) {
          this.changeFMsLength(-1)
        }
        this.changeFMIndex(this.FMsLength - 1);
        this.isOver = false;
        this.changeIsMenus(false);
        this.$nextTick(function () {
          this.isOver = false;
          this.changeIsMenus(true);
        })
      },
      async getComments(url) {
        try {
          let songReviewsData = await this.$http.get(url);
          this.hotComments = songReviewsData.hotComments;
        } catch (e) {
          console.log(e)
        }
      },
      async getPersonalFM(url) {
        let personalFMData = await this.$http.get(url);
        let FMDetails = personalFMData.data;
        this.FMs = FMDetails.map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            time: this.$moment(item.duration).format('mm：ss'),
            singer: item.artists[0].name,
            album: item.album.name,
            pic: item.album.blurPicUrl,
            lrc: '/lyric?id=' + item.id,
            url: 'https://music.163.com/song/media/outer/url?id=' + item.id + '.mp3',
            type: 'fm'
          }
        });
        this.changeFMsLength(this.FMs.length)//储存数组长度
        this.initFM();
      },

      initFM() {
        this.FM = this.FMs[this.FMIndex];//初始化当前页面信息
        let times = this.FM.time.toString().split('：');
        this.endTime = parseFloat(times[0]) * 60 + parseFloat(times[1]);
        let commentsUrl = '/comment/music?id= ' + this.FM.id + '&limit=1';
        this.getFMLrc(this.FM.lrc)
        this.getComments(commentsUrl)

      },
      async getFMLrc(url) {
        let FMLrcData = await this.$http.get(url);
        let FMLrcDetails = FMLrcData.lrc;
        this.lyric = this.parseLyric(FMLrcDetails.lyric);
        var lrcTime = [];
        var lrcList = [];
        for (let [index, value] of Object.entries(this.lyric)) {
          lrcTime.push(index)
          lrcList.push(value)
        }
        this.FMLyricTime = lrcTime;
        this.FMLyricList = lrcList;
      },
      //歌词解析
      parseLyric(lrc) {
        var lyrics = lrc.split("\n");
        var lrcObj = {};
        for (var i = 0; i < lyrics.length; i++) {
          var lyric = decodeURIComponent(lyrics[i]);
          var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
          var timeRegExpArr = lyric.match(timeReg);
          if (!timeRegExpArr) continue;
          var clause = lyric.replace(timeReg, '');
          for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
              sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
          }
        }
        return lrcObj;
      },
      async refresh() {
        console.log('我是fm==')
        let time = new Date();
        let personalFMUrl = '/personal_fm?timestamp=' + this.$moment(time).valueOf();
        await this.getPersonalFM(personalFMUrl);
        localStorage.removeItem("musicPlayList");
        localStorage.setItem("musicPlayList", JSON.stringify(this.FMs));
        this.changeMusicList();
        await this.FMPlay();
      },
      async firstInitFM(){
        let time = new Date();
        let personalFMUrl = '/personal_fm?timestamp=' + this.$moment(time).valueOf();
        let personalFMData = await this.$http.get(personalFMUrl);
        let FMDetails = personalFMData.data;
        this.FMs = FMDetails.map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            time: this.$moment(item.duration).format('mm：ss'),
            singer: item.artists[0].name,
            album: item.album.name,
            pic: item.album.blurPicUrl,
            lrc: '/lyric?id=' + item.id,
            url: 'https://music.163.com/song/media/outer/url?id=' + item.id + '.mp3',
            type: 'fm'
          }
        });
        this.changeFMsLength(this.FMs.length)//储存数组长度
        localStorage.removeItem("musicPlayList");
        localStorage.setItem("musicPlayList", JSON.stringify(this.FMs));
        this.changeMusicList();
        this.initFM();
        this.changeIsplay(true);
        localStorage.removeItem("musicplay");
        localStorage.setItem("musicplay", JSON.stringify(this.FM));
        this.changemusicPlay();
        this.isFMPlay = true;
        if( this.$route.name == 'fm'){
          this.changeIsFM(false);
        }
      }
    },
    created() {
      let musicInfo = JSON.parse(localStorage.getItem("musicplay"));
      if (musicInfo != null) {
        if (musicInfo.type == 'mp3') {
          let time = new Date();
          let personalFMUrl = '/personal_fm?timestamp=' + this.$moment(time).valueOf();
          this.getPersonalFM(personalFMUrl);
          this.isFMPlay = false;
        } else {
          this.changeIsFM(false);
          if (this.FMsLength == -1) {
            this.refresh();
          } else {
            this.FMs = JSON.parse(localStorage.getItem("musicPlayList"));
            this.initFM();
            this.FMPlay();
            this.isFMPlay = true;
          }
        }
      } else {
        this.firstInitFM();

      }
    },
    destroyed() {
      this.changeIsFM(true);
    },
    watch: {
      musicTime(val) {
        let musicInfo = JSON.parse(localStorage.getItem("musicplay"));
        if (musicInfo.type == 'fm') {
          for (let i = 0; i < this.FMLyricList.length; i++) {
            if (val == this.FMLyricTime[i]) {
              this.$Velocity(this.$refs.lyricsBox, 'scroll', {
                container: this.$refs.lyrics,
                delay: 300,
                offset: (i - 2 >= 0 ? i - 2 : 0) * 28 - 221,
                easing: 'ease-out'
              }, 1000);
              this.currentLrc = i
            }
          }
          if (val == this.endTime) {
            this.cutFM();
          }
        }
      },
      isPlay( PlayStatus){
        let musicInfo = JSON.parse(localStorage.getItem("musicplay"));
        if( musicInfo.type == 'fm' ){
          this.isFMPlay =   PlayStatus;
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .per-fm {
    margin: 40px;

    .fm-details {
      display: flex;
      flex-wrap: wrap;
    }
  }

  .fm-cover {
    margin: 25px 35px 10px 35px;
    border: 1px solid #d2d8e6;
    height: 300px;
    width: 300px;
    position: relative;

    i.lyd-bofang2 {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -30px;
      margin-top: -30px;
      font-size: 48px;
      cursor: pointer;
      color: #fff;
    }
    i.lyd-zanting2{
      position: absolute;
      right: 0;
      bottom: -10px;
      font-size: 38px;
      cursor: pointer;
      color: #fff;
    }
    i.lyd-bofang2:hover,i.lyd-zanting2:hover {
      color: rgba(226, 46, 27, 0.68);
    }
    img {
      width: 300px;
      height: 300px;
    }

    .fm-operate {
      display: flex;
      margin-top: 16px;

      i {
        flex: 1;
        font-size: 36px;
        text-align: center;
        cursor: pointer;
      }

      span {

      }
    }
  }

  .fm-detail {
    width: 350px;

    h1 {
      font-size: 20px;
      font-weight: bold;
    }

    div {
      margin-top: 5px;
    }

    span {
      color: #0086b3;
    }

    span:nth-child(1) {
      padding-right: 30px;
    }
  }

  .lyrics {
    width: 348px;
    height: 330px;
    margin-top: 20px;
    max-height: 100vh;
    overflow-y: scroll;
  }

  .lyrics-box {
    position: relative;
  }

  .lyrics-box li {
    line-height: 28px;
  }

  .lyrics::-webkit-scrollbar { /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  }

  .lyrics::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 10px;
    background: rgba(163, 156, 153, 0.29);
  }

  .lyrics::-webkit-scrollbar-track { /*滚动条里面轨道*/
    background: transparent;
    border-right: 1px solid rgb(186, 179, 176);
  }

  .music-play-bottom {
    margin: 60px 20px;
    width: 100%;

    .song-reviews {
      min-height: 500px;
      width: 100%;
    }
  }

  .user-ratings {
    margin-bottom: 40px;

    .music-user {
      padding-bottom: 5px;
      margin-bottom: 15px;
      font-size: 18px;
      border-bottom: 1px solid #d2d8e6;

    }
  }

  .brilliant {
    h4 {
      display: block;
      margin-bottom: 10px;
      border-bottom: 1px solid #d2d8e6;
    }

    > li {
      border-bottom: 1px solid #d2d8e6;
      margin-bottom: 10px;
      padding-bottom: 10px;
      width: 100%;
    }

    .brilliant-img {
      width: 40px;
      margin-right: 10px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;

      }
    }

  }

  .brilliant-content {
    width: 90%;

    span:nth-child(1) {
      color: #0086b3;
    }

    div {
      padding-top: 8px;

      span {
        font-size: 12px;
        color: #909399
      }
    }
  }


</style>
