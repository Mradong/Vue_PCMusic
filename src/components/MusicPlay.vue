<template>
  <div class=" music-play-content">
    <div class="music-play-top">
      <div class="song-cd fl">
        <div class="song-cd-img"></div>
        <img :src="picUrl+'?param=195y195'" alt="" ref="img">
        <ul class="song-cd-iocn">
          <li><i class=" iconfont lyd-xihuan2"></i>喜欢</li>
          <li><i class=" iconfont lyd-yinle2"></i>收藏</li>
          <li><i class=" iconfont lyd-xiazaiguanli-xiazai"></i>下载</li>
          <li><i class=" iconfont lyd-pengyou1"></i>分享</li>
        </ul>
      </div>
      <div class="song-info fl">
        <h1>{{musicTitle}}</h1>
        <span>专辑： <i>暂无信息</i></span>
        <span>歌手：<i>{{singer }}</i></span>
        <span>来源：<i>搜索页</i></span>
        <div class="lyrics" ref="lyrics">
          <ul class="lyrics-box" ref="lyricsBox" id="lyrics">
            <li v-for=" item,index in lyricList" :key=" index" v-bind:class="{ on:index==currentLrc}">{{ item}}</li>
          </ul>
        </div>
      </div>
    </div>
    <router-link to="/music">
      <div><i class=" iconfont lyd-MINIMIZE"></i></div>
    </router-link>
    <div style="clear:both;"></div>
    <div class="music-play-bottom fl" style="margin:60px 20px;width: 100%">
      <div class="Song-reviews fl" style="width: 65%; min-height: 500px">
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
          <li class="fl" v-for="item,index in SongReviews " :key="index">
            <div class="fl brilliant-img">
              <img :src="item.user.avatarUrl+'?param=40y40'" alt="">
            </div>
            <div class="fl brilliant-content">
              <span style="color: skyblue">{{ item.user.nickname}} </span> <span
              style="font-size: 18px;font-family: Arial">:</span> {{item.content }}
              <div style="padding-top: 8px"><span
                style="font-size: 12px;color: #909399">{{ item.time | convertDate }}</span></div>
            </div>
          </li>
        </ul>
      </div>
      <div class="hit-music fr" style="  width:30%;">
        <div class="music-user">相似歌曲</div>
        <div class="sim-song" style="margin-top: 20px">
          <ul>
            <li v-for=" item,index in similaritySong" :key="index"
                style="width: 200px; height: 70px; display: block;margin-bottom: 5px">
              <div class="fl" @click="$router.go(0)">
                <img :src="item.album.picUrl+'?param=60y60'" alt="" style="width: 60px;height: 60px; cursor: pointer">
              </div>
              <div class="fl" style="margin: 10px 0 0 10px;line-height: 28px">
                <h3>{{item.name | hanziLimit(8)}}</h3>
                <span v-for="artist,i in item.artists" :key="i">
                  {{artist.name}}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="hit-music fr" style="  width:30%;margin-top: 20px">
        <div class="music-user">喜欢这首歌的人</div>
        <div class="sim-song" style="margin-top: 20px">
          <ul>
            <li v-for=" item,index in SongUser" :key="index">
              <div class="sim-user">
                <img :src="item.avatarUrl+'?param=40y40'" alt="" class="fl">
                <span class="sim-user-nickname fl" style="padding-right: 15px"> {{item.nickname }}</span>
                <span class="sim-user-nickname fr" > {{item.recommendReason }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "MusicPlay",
    data() {
      return {
        lyric: [],
        lyricTime: [],
        lyricList: [],
        picUrl: '',
        musicTitle: '',
        singer: '',
        currentLrc: 0,
        SongReviews: [],
        similaritySong: [],
        SongUser:[],
      };
    },
    methods: {
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
      changeSong(i) {
        console.log(i)
      }
    },
    created: function () {
      let musicPlay = JSON.parse(localStorage.getItem("musicplay"));
      //歌词api
      let lrcUrl = musicPlay.lrc;
      //评论api
      let SongReviews = '/comment/music?id= ' + musicPlay.id + '&limit=1';
      //相似歌曲api
      let similaritySong = '/simi/song?id=' + musicPlay.id;
      let recommendUser = '/simi/user?id=' + musicPlay.id;

      this.picUrl = musicPlay.pic;
      this.musicTitle = musicPlay.name;
      this.singer = musicPlay.singer;
      //获取歌词
      this.$axios.get(lrcUrl).then((response) => {
        this.lyric = this.parseLyric(response.data.lrc.lyric);
        var lrcTime = [];
        var lrcList = [];
        for (let [index, value] of Object.entries(this.lyric)) {
          lrcTime.push(index)
          lrcList.push(value)
        }
        this.lyricTime = lrcTime;
        this.lyricList = lrcList;
      }).catch((error) => {
        console.log(error);
      });
      //获取歌曲评论
      this.$axios.get(SongReviews).then((response) => {
        this.SongReviews = response.data.hotComments;
      }).catch((error) => {
        console.log(error);
      });
      //获取相似歌曲
      this.$axios.get(similaritySong).then((response) => {
        this.similaritySong = response.data.songs;
      }).catch((error) => {
        console.log(error);
      });
      //获取最近 5 个听了这首歌的用户
      this.$axios.get(recommendUser).then((response) => {
        this.SongUser = response.data.userprofiles;
      }).catch((error) => {
        console.log(error);
      });
    },
    computed: {
      getmusic() {
        return this.$store.state.musicTime;
      }
    },
    watch: {
      getmusic(val, oldval) {
        for (let i = 0; i < this.lyricList.length; i++) {
          if (val == this.lyricTime[i]) {
            this.$Velocity(this.$refs.lyricsBox, 'scroll', {
              container: this.$refs.lyrics,
              delay: 300,
              offset: (i - 2 >= 0 ? i - 2 : 0) * 28 - 221,
              easing: 'ease-out'
            }, 1000);
            this.currentLrc = i
          }
        }
      },
    }
  }
</script>
<style>
  .user-ratings > .el-input {
    width: 97%;
    background-color: #dcdfe65e;
    padding: 5px;
    margin-bottom: 20px;
  }

  .user-ratings > .el-input > .el-input__inner {
    height: 30px;
    line-height: 30px;

  }
</style>
<style scoped>
  .sim-song .sim-user{
    height: 40px;
    margin-bottom: 20px;
  }
  .sim-song .sim-user img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;

  }
  .sim-song .sim-user-nickname{
    padding: 10px;
    font-size: 12px;
  }
  .on {
    color: red;
  }
  .music-play-content {
    position: relative;
    color: #333;
    text-align: center;
    height: 580px;
    overflow: hidden;
    overflow-y: auto;
    width: 100%;
    padding: 20px;
  }

  .music-play-content:before {
    background: url(../assets/imges/smbj.png) repeat;
    background-size: cover;
    width: 1020px;
    height: 580px;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1; /*-1 可以当背景*/
    -webkit-filter: blur(1px);
    filter: blur(1px);
  }

  .song-cd-img {
    float: left;
    width: 210px;
    height: 210px;
    background: url(../assets/imges/coverall.png) -142px -580px no-repeat;
    transform: scale(1.5);
    position: relative;
    top: 100px;
    left: 100px;
    z-index: 99;
  }

  .song-cd img {
    width: 205px;
    height: 205px;
    position: relative;
    top: 100px;
    left: -112px;
  }

  .song-cd ul.song-cd-iocn {
    position: relative;
    top: 200px;
    left: 40px;
  }

  .song-cd ul.song-cd-iocn li {
    display: block;
    width: 70px;
    height: 30px;
    background-color: #eeeeee;
    float: left;
    margin: 5px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #d7d7d7;
    border-radius: 5px;
  }

  .song-cd ul.song-cd-iocn li i {
    padding-right: 3px;
    font-size: 18px;
    position: relative;
    top: 2px;
  }

  .song-info {
    width: 488px;
    margin: 25px 0 0 60px;

  }

  .song-info h1 {
    display: block;
    margin-bottom: 5px;
    font-size: 22px;
  }

  .song-info span i {
    padding: 3px;
    color: #297ade;
  }

  .lyrics {
    width: 388px;
    height: 350px;
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

  .lyd-MINIMIZE {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 30px;

  }

  .music-user {
    padding-bottom: 5px;
    margin-bottom: 15px;
    font-size: 18px;
    border-bottom: 1px solid #d2d8e6;

  }

  .brilliant h4 {
    display: block;
    margin-bottom: 10px;
    border-bottom: 1px solid #d2d8e6;
  }

  .brilliant > li {
    border-bottom: 1px solid #d2d8e6;
    margin-bottom: 10px;
    padding-bottom: 10px;
    width: 100%;
  }

  .brilliant .brilliant-img {
    width: 40px;
    margin-right: 10px;

  }

  .brilliant .brilliant-img img {
    width: 40px;
    height: 40px;
    border-radius: 50%;

  }

  .brilliant .brilliant-content {
    width: 90%;
  }
</style>
