<template>
  <div>
    <div class="music-search-result"><h2>搜索 "<i style="color: blue"> {{ name }} </i>"，共找到了{{musicNum}}首单曲</h2></div>
    <div >
      <h2 style="display: block; border: 1px solid #f0eeec; padding: 5px 25px"> 最佳匹配</h2>
      <div class="best-fit fl" v-for="item,index in bestFit" :key="index" v-if="item[0] =='artist'" >
        {{ item[1].name}}
        <div class="best-fit-content">
          <div class="best-fit-img fl"><img :src="item[1][0].picUrl+'?param=55y50'" alt=""></div>
          <div class="best-fit-zi fl" style="margin-top: 10px;">
            <span>歌手：{{ item[1][0].name}}</span>
          </div>
          <div class="best-fit-go fr">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <div class="best-fit fl" v-for="item,index in bestFit" :key="index" v-if="item[0] =='album'" >
        {{ item[1].name}}
        <div class="best-fit-content">
          <div class="best-fit-img fl"><img :src="item[1][0].picUrl+'?param=55y50'" alt=""></div>
          <div class="best-fit-zi fl">
            <h3>专辑：{{ item[1][0].name}}</h3>
            <span>{{ item[1][0].artists[0].name}}</span>
          </div>
          <div class="best-fit-go fr">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <div class="best-fit fl" v-for="item,index in bestFit" :key="index" v-if="item[0] =='mv'" >
        {{ item[1].name}}
        <div class="best-fit-content">
          <div class="best-fit-img fl"><img :src="item[1][0].cover+'?param=55y50'" alt=""></div>
          <div class="best-fit-zi fl">
            <h3><span class="span_mv">mv</span>{{ item[1][0].name}}</h3>
            <span>{{ item[1][0].artists[0].name}}</span>
          </div>
          <div class="best-fit-go fr">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div style="clear:both;"></div>
      <el-row class="music-menu">
        <el-col :span="1">&nbsp;&nbsp;</el-col>
        <el-col :span="2">操作</el-col>
        <el-col :span="7">音乐标题</el-col>
        <el-col :span="4">歌手</el-col>
        <el-col :span="4">专辑</el-col>
        <el-col :span="2">时长</el-col>
        <el-col :span="4">热度</el-col>
      </el-row>
      <div class="music-list">
        <el-row v-for=" (item,index) in musicSearchList" :key="index" style=" padding:4px 6px;"
                @click.native="addClass(index)" v-bind:class="{ classred:index==current}"
                @dblclick.native="cutMusic(index)">
          <el-col :span="1" v-if="index!=doubleCurrent">{{ index+1 }}</el-col>
          <el-col :span="1" v-if="index==doubleCurrent"><i class="lyd-yinliang iconfont"></i></el-col>
          <el-col :span="2"><i class="el-icon-star-off"></i><i class="el-icon-download"></i></el-col>
          <el-col :span="7">{{item.name | hanziLimit(14) }}</el-col>
          <el-col :span="4">{{ item.singer | hanziLimit(7) }}</el-col>
          <el-col :span="4">{{ item.album | hanziLimit(7) }}</el-col>

          <el-col :span="2">{{item.time | mvDate}}</el-col>
          <el-col :span="4" style=" padding-top: 4px;">
            <el-progress :text-inside="true" :show-text="false" :stroke-width="14"
                         :percentage=" Math.floor(Math.random()*(100 - 50) + 50)"></el-progress>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapState,mapGetters, mapMutations, mapActions} from 'vuex'

  export default {
    name: "search",
    data() {
      return {
        id: this.$route.query.id,
        name: this.$route.query.name,
        current: null,
        doubleCurrent: null,
        musicSearchList: [],
        musicNum: '',
        currentSrc: '',
        bestFit: []
      };
    },
    computed: {
      ...mapState([
        'musicTime',
        'isRouterAlive'
        ]),
      ...mapGetters([])
    },
    methods: {
      ...mapMutations({
        changemusicPlay: 'changemusicPlay'
      }),
      addClass: function (index) {
        this.current = index;
      },
      cutMusic(index) {
        this.doubleCurrent = index;
        let musicplay = this.musicSearchList[index];
        let  song = 'http://musicapi.leanapp.cn/song/detail?ids='+ musicplay.id ;
        this.$axios.get(song ).then((response) => {
          musicplay.pic = response.data.songs[0].al.picUrl ;
          localStorage.setItem("musicplay", JSON.stringify(musicplay));
          this.changemusicPlay();
        }).catch((error) => {
          console.log(error);
        })
      }

    },
    created: function () {
      let  songs = 'http://musicapi.leanapp.cn/search?keywords='+ this.name +'&type=1';
      let  songDetail = 'http://musicapi.leanapp.cn/search/multimatch?keywords='+ this.name ;
      this.$axios.get(songDetail ).then((response) => {
        this.restaurants = response.data.result;
        let searchResult = Object.entries(this.restaurants);
        let searchResultLen = searchResult.length;
        let orderlen = searchResult[searchResultLen - 1][1];
        let orderSearchResult = [];
        searchResult.map(item => {
          for (let i = 0; i < orderlen.length; i++) {
            if (item[0] == orderlen[i]) {
              orderSearchResult[i] = item;
            }
          }
        })
        this.bestFit =searchResult;
        console.log( this.bestFit)
      }).catch((error) => {
        console.log(error);
      }),
      this.$axios.get(songs).then((response) => {
        console.log( response.data.result.songs)
        let musicSearchList = response.data.result.songs.map((item,index)=>{
            return {
              id:item.id,
              name:item.name,
              time:item.duration,
              singer:item.artists.map((singers)=>{
                return {
                  singers:singers.name,
                }
              }),
              album:item.album.name,
              lrc:'http://musicapi.leanapp.cn/lyric?id='+item.id,
              url:'https://music.163.com/song/media/outer/url?id='+item.id+'.mp3'
            }
        });
        for(let value of musicSearchList ){
          var valuelen = value.singer.length;
          var singers ='';
          for( let i=0;i < valuelen;i++){
            singers += value.singer[i].singers.toString()+' ';

          }
          value.singer = singers;
        };
        this.musicSearchList = musicSearchList;
        this.musicNum = musicSearchList.length;
      }).catch((error) => {
        console.log(error);
      })
    },
    watch: {
      $route(to, from) {
        switch (this.$route.path) {
          case '/music/recommend':
            this.current = 1;
            break;
          case 2:
            break;
          default:
        }
      }
    }
  }

</script>

<style scoped>
  span.span_mv{
    display: inline-block;
    width: 25px;
    height: 15px;
    border: 1px solid rgba(162, 0, 0, 0.69);
    text-align: center;
    color: rgba(162, 0, 0, 0.69);
    position: relative;
    top: 0;
    font-family: Arial;
    margin-right: 5px;
  }
  .best-fit {
    height: 100px;
    padding: 0 10px;
  }

  .best-fit-content {
    margin-top: 16px;
    padding: 5px;
    border: 1px solid #f0eeec;
    width: 250px;
    height: 55px;
  }

  .best-fit-img img {
    margin-top: 3px;
    width: 55px;
    height: 50px;
  }

  .best-fit-zi {
    padding: 10px;
    font-size: 12px;
  }

  .best-fit-go {
    margin-top: 10px;
    font-size: 25px;
    cursor: pointer;
  }

  .music-search-result {
    height: 90px;
    line-height: 90px;
    margin-left: 20px;
  }

  .music-menu > div {
    border: 1px solid #f0eeec;
    line-height: 24px;
    padding: 5px 10px;
  }

  div.music-menu > div:first-child {
    border-left: 0;
  }

  div.music-menu > div:nth-child(odd) {
    border-right: 0;
  }

  .classred {
    background-color: #F5F5F5 !important;
  }

  .music-list > div.el-row:hover {
    background-color: #F5F5F5;
  }

  .music-list > div.el-row > div {
    line-height: 14px;
    padding: 5px 10px;
  }

  .music-list > div.el-row > div > i {
    padding: 0 3px;
    font-size: 16px;
  }

  .music-list > div.el-row > div > i.lyd-yinliang {
    color: red;
  }

  div.music-list > div:nth-child(odd) {
    background-color: #fff;
  }

  div.music-list > div:nth-child(even) {
    background-color: #f6f6f652;
  }
</style>
