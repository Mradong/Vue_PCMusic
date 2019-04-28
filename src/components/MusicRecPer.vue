<template>
  <div style="margin: 20px">
    <el-carousel :interval="4000" type="card" height="200px" class="new-nav">
      <el-carousel-item v-for="(item,index) in bannerList" :key="index">
        <img :src="item.imageUrl+'?param=400y200'" alt="" @click="cutBanner(item.targetId,item.targetType )">
      </el-carousel-item>
    </el-carousel>
    <div>
      <div class="song_menu">
        <el-row type="flex" class="row-bg">
          <el-col :span="22">
            <div class="grid-content bg-purple fz20">推荐歌单</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple-light" style="cursor: pointer" @click="changeMore(1)">更多></div>
          </el-col>
        </el-row>
      </div>
      <div class="song_content">
        <ul>
          <li v-for="(item,index) in personalizedList" :key="index" v-if='index<10'>
            <router-link :to="{name:'menu', query:{id: item.id}}"><img :src="item.picUrl+'?param=140y140'" alt=""
                                                                       style="width: 100%"></router-link>
            <router-link :to="{name:'menu', query:{id: item.id}}"><p> {{item.name}}</p></router-link>
          </li>
        </ul>
      </div>
    </div>
    <div style="clear:both;"></div>

    <div class="personalizedPrivate" style="margin-top: 30px">
      <div class="song_menu">
        <el-row type="flex" class="row-bg">
          <el-col :span="22">
            <div class="grid-content bg-purple fz20">推荐MV</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple-light">更多></div>
          </el-col>
        </el-row>
      </div>
      <div class="song_content">
        <ul>
          <li v-for="(item,index) in personalizedMv" :key="index" style="width:230px; margin: 0 12px" v-if=" index < 3">
            <router-link :to="{name:'mv', query: { id: item.id ,type: 'mv'} }"><img :src="item.picUrl +'?param=230y130'"
                                                                                    alt="" style="width: 100%">
            </router-link>
            <router-link to="/music/mv"><h2> {{item.name | hanziLimit(18) }}</h2></router-link>
            <p> {{item.artistName}}</p>
          </li>
        </ul>
      </div>
    </div>

    <div style="clear:both;"></div>
    <div class="newSong" style="margin-top: 30px">
      <div class="song_menu">
        <el-row type="flex" class="row-bg">
          <el-col :span="22">
            <div class="grid-content bg-purple fz20">最新音乐</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple-light">更多></div>
          </el-col>
        </el-row>
      </div>
      <div class="new_song">
        <ul>
          <li v-for="(item,index) in newSongList" :key="index" @dblclick="cutMusic(index)">
            <div class="fl" style="padding-right: 5px">
              <h4>{{index | completion(2,'0')}}</h4><img :src="item.song.album.picUrl+'?param=40y40'" alt=""
                                                         style="width: 40px;height: 40px">
            </div>
            <div class="fl">
              <p v-if="item.song.name.length >10">{{item.song.name}}<span v-if="item.song.alias[0]">({{item.song.alias[0] | hanziLimit(4) }} </span>
              </p>
              <p v-if="item.song.name.length <= 10">{{item.song.name}}<span v-if="item.song.alias[0]">({{item.song.alias[0] }}) </span>
              </p>

              <span>{{item.song.artists[0].name }}</span></div>
          </li>
        </ul>
      </div>
    </div>
    <div style="clear:both;"></div>
    <div class="personalizedPrivate" style="margin-top: 30px">
      <div class="song_menu">
        <el-row type="flex" class="row-bg">
          <el-col :span="22">
            <div class="grid-content bg-purple fz20">独家放送</div>
          </el-col>
          <el-col :span="2">
            <router-link :to="{name:'djfs'}">
              <div class="grid-content bg-purple-light">更多></div>
            </router-link>
          </el-col>
        </el-row>
      </div>
      <div class="song_content">
        <ul>
          <li v-for="(item,index) in personalizedPrivate" :key="index" style="width:230px; margin: 0 12px">
            <router-link :to="{name:'mv', query: { id: item.videoId,type: 'djfs' } }"><img
              :src="item.sPicUrl +'?param=230y130'" alt="" style="width: 100%"></router-link>
            <router-link :to="{name:'mv', query: { id: item.videoId,type: 'djfs'} }"><p> {{item.copywriter}}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'

  export default {
    name: "MusicRecPer",
    data() {
      return {
        bannerList: [],
        personalizedList: [],
        personalizedPrivate: [],
        newSongList: [],
        personalizedMv: [],
      };
    },
    methods: {
      ...mapMutations({
        changemusicPlay: 'changemusicPlay',
        changeRecActiveName: 'changeRecActiveName'
      }),
      cutBanner(id, type) {
        console.log(type)
        switch (type) {
          case 1:
            this.getBannerMusic(id);
            break;
          case 3000:
            alert('商店功能，支持正版')
            break;
          case 10 :
            alert('专辑功能开发ing。。。')
            break;
          case 1004:
            this.$router.push({
                name: 'mv',
                query: {
                  id: id,
                  type: 'mv'
                }
              }
            );
            break;
          case 1000:
            this.$router.push({
                name: 'menu',
                query: {
                  id: id
                }
              }
            );
            break;
          default:
            console.log('默认的')
            break;
        }
      },
      async getBannerMusic(id) {
        try {
          this.$router.push({
              name: 'play',
            }
          );
          let bannerMusicUrl = '/song/detail?ids=' + id;
          let bannerMusicData = await this.$http.get(bannerMusicUrl);
          let musicInfo = {
            id: bannerMusicData.songs[0].id,
            name: bannerMusicData.songs[0].name,
            time: this.$moment(bannerMusicData.songs[0].dt).format('mm：ss'),
            singer: bannerMusicData.songs[0].ar[0].name,
            album: bannerMusicData.songs[0].al.name,
            pic: bannerMusicData.songs[0].al.picUrl,
            lrc: '/lyric?id=' + bannerMusicData.songs[0].id,
            url: 'https://music.163.com/song/media/outer/url?id=' + bannerMusicData.songs[0].id + '.mp3',
          };
          localStorage.setItem("musicplay", JSON.stringify(musicInfo));
          this.changemusicPlay();
        } catch (e) {
          console.log(e)
        }
      },
      cutMusic(index) {
        let musicInfo = {
          id: this.newSongList[index].song.id,
          name: this.newSongList[index].song.name,
          time: this.$moment(this.newSongList[index].song.duration).format('mm：ss'),
          singer: this.newSongList[index].song.artists[0].name,
          album: this.newSongList[index].song.alias[0],
          pic: this.newSongList[index].song.album.picUrl,
          lrc: '/lyric?id=' + this.newSongList[index].song.id,
          url: 'https://music.163.com/song/media/outer/url?id=' + this.newSongList[index].song.id + '.mp3',
        };
        localStorage.setItem("musicplay", JSON.stringify(musicInfo));
        this.changemusicPlay();
      },
      changeMore(index) {
        this.changeRecActiveName(index);
      },
      async getBanner() {
        try {
          let bannerUrl = '/banner';
          let bannerData = await this.$http.get(bannerUrl);
          this.bannerList = bannerData.banners;
          console.log(this.bannerList)
        } catch (e) {
          console.log(e)
        }
      },
      async getPersonalized() {
        try {
          let personalizedUrl = '/personalized?limit=10';
          let personalizedData = await this.$http.get(personalizedUrl);
          this.personalizedList = personalizedData.result;
        } catch (e) {
          console.log(e)
        }
      },
      async getPersonalizedPrivate() {
        try {
          let personalizedPrivateUrl = '/personalized/privatecontent';
          let personalizedPrivateData = await this.$http.get(personalizedPrivateUrl);
          this.personalizedPrivate = personalizedPrivateData.result;
        } catch (e) {
          console.log(e)
        }
      },
      async getPersonalizedNewSong() {
        try {
          let personalizedNewSongUrl = '/personalized/newsong';
          let personalizedNewSongData = await this.$http.get(personalizedNewSongUrl);
          this.newSongList = personalizedNewSongData.result;
        } catch (e) {
          console.log(e)
        }
      },
      async getPersonalizedMv() {
        try {
          let personalizedMvUrl = '/personalized/mv';
          let personalizedMvData = await this.$http.get(personalizedMvUrl);
          this.personalizedMv = personalizedMvData.result;
        } catch (e) {
          console.log(e)
        }
      },
    },
    created: function () {
      this.getBanner();
      this.getPersonalized();
      this.getPersonalizedPrivate();
      this.getPersonalizedNewSong();
      this.getPersonalizedMv();
    }
  }
</script>

<style scoped>
  .new-nav img {
    width: 400px;
    height: 200px;
  }

  .new-nav .new-nav-title {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #07070738;
    color: aliceblue;
    margin: 0 10px;

  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .song_menu {
    border-bottom: 1px solid rgba(6, 12, 6, 0.22);
  }

  .song_content {
    margin-top: 10px;
  }

  .song_content > ul > li {
    margin: 5px;
    width: 140px;
    float: left;
    height: 195px;
    font-size: 12px;
  }

  .new_song {
    width: 96%;
    height: 300px;
    border: 1px solid #d7d7d7;
    margin: 10px;
    background-color: rgba(226, 226, 226, 0.14);
  }

  .new_song > ul > li {
    float: left;
    width: 49%;
    height: 50px;
    padding: 10px 0 0 6px;
    border-right: 1px solid rgba(150, 165, 165, 0.17);

  }

  .new_song > ul > li:nth-child(3), .new_song > ul > li:nth-child(4), .new_song > ul > li:nth-child(7), .new_song > ul > li:nth-child(8) {
    background-color: rgb(246, 246, 246);

  }

  .new_song > ul > li h4 {
    width: 20px;
    padding-right: 5px;
    display: inline-block;
    position: relative;
    top: -15px;
  }
</style>
