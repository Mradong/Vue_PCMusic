<template>
  <div class="music-left">
    <div class="music-recommend">
      <h3>推荐</h3>
      <ul class="music-nav">
        <router-link to="/recommend">
          <li v-bind:class="{on:1== current}"><i class="iconfont lyd-yinle"></i>发现音乐</li>
        </router-link>
        <li><i class="iconfont lyd-diantai"></i>私人FM</li>
        <li><i class="iconfont lyd-shipin"></i>视频</li>
        <li><i class="iconfont lyd-pengyou"></i>朋友</li>
      </ul>
    </div>
    <div class="music-recommend">
      <h3>我的音乐</h3>
      <ul class="music-nav">
        <router-link to="/music/recommend">
          <li><i class="iconfont lyd-yinle3"></i>本地音乐</li>
        </router-link>
        <li><i class="iconfont lyd-xiazaiguanli-xiazai"></i>下载管理</li>
      </ul>
    </div>
    <el-menu :default-openeds="['1']" class="el-menu-vertical-demo" background-color="transparent" @open="handleOpen"
             @close="handleClose" :collapse="isCollapse">
      <el-submenu index="1">
        <template slot="title">
          <span slot="title">创建歌单</span>
        </template>
        <el-menu-item-group>
          <span slot="title"><i class="iconfont lyd-xihuan1"></i>我喜欢的音乐</span>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <el-menu :default-openeds="['1']" class="el-menu-vertical-demo" background-color="transparent" @open="handleOpen"
             @close="handleClose" :collapse="isCollapse">
      <el-submenu index="1"  v-if="status == 200">
        <template slot="title">
          <span slot="title">收藏的歌单</span>
        </template>
        <el-menu-item-group>
          <span slot="title"><i class="iconfont lyd-xihuan1"></i>我喜欢的音乐</span>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <div class="box-music-card" v-if=" musicPlay != null ">
      <div class="best-fit">
        <router-link to="/play">
          <div class="best-fit-content">
            <div class="best-fit-img fl"><img
              :src="musicPlay.pic+'?param=52y52'" alt=""></div>
            <div class="best-fit-zi fl">
              <p>{{ musicPlay.name | hanziLimit(7)}}</p>
              <span>{{ musicPlay.singer | hanziLimit(7) }}</span>
            </div>
            <div class="best-fit-ico fr">
              <p><i class="iconfont lyd-xihuan1"></i></p>
              <span><i class="iconfont lyd-yinle1"></i> </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {

    name: "MusicLeft",
    data() {
      return {
        isCollapse: false,
        current: 1,
        musicPlay: null,
        status:null,
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    computed: {
      ...mapState([
        'loginStatus',
      ]),
      getMusicPlay() {
        return this.$store.state.musicPlay;
      }

    },
    created: function () {
      this.musicPlay = JSON.parse( localStorage.getItem("musicplay"));
      this.status = sessionStorage.getItem('userStatus') ;
    },
    watch: {
      $route(to, from) {
        switch (this.$route.path) {
          case '/recommend':
            this.current = 1;
            break;
          case 2:
            break;
          default:
            this.current = 0;

        }
      },
      loginStatus( status ){
        this.status = status ;
      },
      getMusicPlay(val) {
        this.musicPlay = JSON.parse(val);
      }
    }
  }
</script>

<style scoped>
  .music-left {
    height: 580px;
    position: relative;
  }

  .on {
    background: url(../assets/imges/xht.png) no-repeat left top #d9d1d187;
  }

  .music-recommend h3 {
    height: 34px;
    line-height: 34px;
    color: #7D7D7D;
    margin-left: 10px;

  }

  ul.music-nav {
    padding: 5px 0;
  }

  ul.music-nav li {
    height: 25px;
    line-height: 25px;
    padding: 5px 20px;

  }

  ul.music-nav a {
    text-decoration: none;
  }

  ul.music-nav li:hover {
    color: black;
    cursor: pointer;
  }

  ul.music-nav li i {
    padding-right: 4px;
  }

  .box-music-card {
    position: fixed;
    top: 568px;
    background-color: #ebedeb;
    width: 196px;
    height: 61px;
    padding: 2px;
    border-top: 1px solid rgba(210, 199, 211, 0.46);
    border-bottom: 1px solid rgba(210, 199, 211, 0.46);
  }

  .best-fit-img {
    padding: 6px 0 0 10px;
  }

  .box-music-card .best-fit-img img {
    margin: 1px;
    border: 1px solid rgba(6, 12, 6, 0.46);
    width: 50px;
    height: 50px;
  }

  .box-music-card .best-fit-zi {
    font-size: 12px;
    margin: 12px 4px 0;
  }

  .box-music-card .best-fit-zi p {
    margin-bottom: 4px;
  }

  .box-music-card .best-fit-ico {
    margin: 8px 5px 0;
  }
</style>
