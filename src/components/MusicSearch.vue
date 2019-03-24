<template>
  <div>
    <div class="music-search-result"><h2>搜索 "<i style="color: blue"> {{ name }} </i>"，共找到了{{musicNum}}首单曲</h2></div>
    <div>
      <h2> 最佳匹配</h2>
      <div class="best-fit">
        <div class="best-fit-content">
          <div class="best-fit-img fl"><img :src="bestFit.pic" alt=""></div>
          <div class="best-fit-zi fl">
            <p>歌名：{{bestFit.name | hanziLimit(10)}}</p>
            <span>歌手：{{bestFit.singer }} </span>
          </div>
          <div class="best-fit-go fr">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
    <div>
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
          <el-col :span="4">{{item.singer | hanziLimit(7)}}</el-col>
          <el-col :span="4">暂无专辑信息</el-col>

          <el-col :span="2">{{item.time | musicDate}}</el-col>
          <el-col :span="4" style=" padding-top: 4px;">
            <el-progress :text-inside="true" :show-text="false" :stroke-width="14"
                         :percentage="100-(index*2) >=0? 100-(index*2): 0"></el-progress>
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
        localStorage.setItem("musicplay", JSON.stringify(musicplay));
        this.changemusicPlay();
      }

    },
    created: function () {
      let url = 'https://api.bzqll.com/music/netease/search?key=579621905&type=song&limit=50&offset=0&s=' + this.name;
      let musicUrl = 'https://api.bzqll.com/music/netease/song?key=579621905&id=' + this.id;
      this.$axios.get(url).then((response) => {
        this.musicSearchList = response.data.data;
        this.musicNum = response.data.data.length;
      }).catch((error) => {
        console.log(error);
      })
      this.$axios.get(musicUrl).then((response) => {
        this.bestFit = response.data.data;
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
  .best-fit {
    border-top: 1px solid #f0eeec;
    height: 100px;
    padding: 0 30px;
  }

  .best-fit-content {
    margin-top: 16px;
    padding: 5px;
    border: 1px solid #f0eeec;
    width: 270px;
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
