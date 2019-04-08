<template>
  <div style="margin: 20px" ref="menusBox">
    <div class="song_menu">
        <div class="hot-labels">
          <ul>
            <li><h2>热门标签:</h2></li>
            <li><a href="javascript:;">华语</a>|</li>
            <li><a href="javascript:;">流行</a>|</li>
            <li><a href="javascript:;">摇滚</a>|</li>
            <li><a href="javascript:;">民谣</a>|</li>
            <li><a href="javascript:;">电子</a>|</li>
            <li><a href="javascript:;">轻音乐</a>|</li>
            <li><a href="javascript:;">影视原声</a> |</li>
            <li><a href="javascript:;">ACG</a> |</li>
            <li><a href="javascript:;">怀旧</a> |</li>
            <li><a href="javascript:;">治愈</a></li>
          </ul>
        </div>
    </div>
    <div class="song_content">
      <ul style="overflow: hidden">
        <li v-for="(item,index) in musicMenus" :key="index">
          <router-link :to="{name:'menu', query:{id: item.id}}"><img :src="item.coverImgUrl+'?param=176y178'" alt=""
                                                                     style="width: 100%"></router-link>
          <router-link :to="{name:'menu', query:{id: item.id}}"><p> {{item.name}}</p></router-link>
        </li>
      </ul>
      <div class="block">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
          :total="100">
        </el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapMutations} from 'vuex'
  export default {
    name: "MusicMenus",
    data() {
      return {
        musicMenus:[],
        currentPage:1,
        isMenus:true,
      }
    },
    created: function () {
      let musicMenusUrl = '/top/playlist?limit=52';
      this.$axios.get(musicMenusUrl).then((response) => {
        this.musicMenus = response.data.playlists;
      }).catch((error) => {
        console.log(error);
      });
    },
    methods:{
      ...mapMutations({
        changeIsMenus:'changeIsMenus'
      }),
      handleCurrentChange(val){

        this.isMenus = false;
        this.changeIsMenus(false);
        this.$nextTick(() => {
          this.isMenus = false;
          this.changeIsMenus(true);
        })

        console.log( '12')
        let musicMenusUrl = '/top/playlist?highquality&limit=52&offset='+ (val-1) * 52;
        this.$axios.get(musicMenusUrl).then((response) => {
          this.musicMenus = response.data.playlists;
        }).catch((error) => {
          console.log(error);
        });
      },
    }
  }
</script>

<style scoped>
  .song_menu {
    height: 50px;
    border-bottom: 1px solid rgba(6, 12, 6, 0.22);
  }

  .song_content {
    margin-top: 10px;
  }

  .song_content > ul > li {
    margin: 5px;
    width: 176px;
    float: left;
    height: 223px;
    font-size: 12px;
  }

  .new_song {
    width: 96%;
    height: 300px;
    border: 1px solid #d7d7d7;
    margin: 10px;
    background-color: rgba(226, 226, 226, 0.14);
  }
  .block .el-pagination{
    margin: 0 auto;
    width: 70%;
  }
  .hot-labels ul li{
    float: left;
  }
  .hot-labels ul li a{
    float: left;
    padding: 0 12px;
  }
</style>
