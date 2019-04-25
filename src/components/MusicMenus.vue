<template>
  <div style="margin: 20px" ref="menusBox">
    <div class="song_menu">
      <div class="hot-labels">
        <ul>
          <li><h2>热门标签:</h2></li>
          <li><a href="javascript:;" @click="tagGet($event)" :class="{ on:tag == '华语' }">华语</a>|</li>
          <li><a href="javascript:;" @click="tagGet($event)" :class="{ on:tag == '流行' }">流行</a>|</li>
          <li><a href="javascript:;" @click="tagGet($event)" :class="{ on:tag == '摇滚' }">摇滚</a>|</li>
          <li><a href="javascript:;" @click="tagGet($event)" :class="{ on:tag == '民谣' }">民谣</a>|</li>
          <li><a href="javascript:;" @click="tagGet($event)" :class="{ on:tag == '电子' }">电子</a>|</li>
          <li><a href="javascript:;" @click="tagGet($event)" :class="{ on:tag == '轻音乐' }">轻音乐</a>|</li>
          <li><a href="javascript:;" @click="tagGet($event)" :class="{ on:tag == '影视原声' }">影视原声</a> |</li>
          <li><a href="javascript:;" @click="tagGet($event)" :class="{ on:tag == 'ACG' }">ACG</a> |</li>
          <li><a href="javascript:;" @click="tagGet($event)" :class="{ on:tag == '怀旧' }">怀旧</a> |</li>
          <li><a href="javascript:;" @click="tagGet($event)" :class="{ on:tag == '治愈' }">治愈</a></li>
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
          :current-page.sync="musicMenusCurrentPage"
          @current-change="handleCurrentChange"
          :total="100">
        </el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "MusicMenus",
    data() {
      return {
        musicMenus: [],
        isMenus: true,
      }
    },
    computed: {
      ...mapState([
        'musicMenusCurrentPage',
        'tag'
      ]),
    },
    created: function () {
      let musicMenusUrl = '/top/playlist?highquality&limit=52&offset=' + (this.musicMenusCurrentPage - 1) * 52 + '&cat=' + this.tag;
      this.getMenus(musicMenusUrl);
    },
    methods: {
      ...mapMutations({
        changeTag: 'changeTag',
        changeIsMenus: 'changeIsMenus',
        changeCurrentPage: 'changeCurrentPage'
      }),
      handleCurrentChange(index) {
        this.isMenus = false;
        this.changeIsMenus(false);
        this.$nextTick(() => {
          this.isMenus = false;
          this.changeIsMenus(true);
        })
        this.changeCurrentPage(index);
      },
      async getMenus(menusUrl) {
        try {
          let menusDatas = await this.$http.get(menusUrl);
          this.musicMenus = menusDatas.playlists;
        } catch (e) {
          console.log(e)
        }
      },
      tagGet(e) {
        let musicMenusUrl = '/top/playlist?highquality&limit=52&offset=0&cat=' + e.srcElement.innerHTML;
        this.getMenus(musicMenusUrl);
        this.changeTag(e.srcElement.innerHTML);
        this.changeCurrentPage(1);
      }
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

  .block .el-pagination {
    margin: 0 auto;
    width: 70%;
  }

  .hot-labels ul li {
    float: left;
  }

  .hot-labels ul li a {
    float: left;
    padding: 0 12px;
  }
</style>
