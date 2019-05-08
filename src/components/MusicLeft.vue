<template>
  <div class="music-left">
    <div class="music-recommend">
      <h3>推荐</h3>
      <ul class="music-nav">
        <router-link to="/recommend">
          <li v-bind:class="{on:1== current}" @click=" current = 1 "><i class="iconfont lyd-yinle"></i>发现音乐</li>
        </router-link>
        <router-link to="/fm">
        <li v-bind:class="{on:2== current}" @click=" current = 2 "><i class="iconfont lyd-diantai"></i>私人FM</li>
        </router-link>
        <router-link to="/djfs">
        <li  v-bind:class="{on:3== current}" @click=" current = 3 "><i class="iconfont lyd-shipin"></i>最新MV</li>
        </router-link>
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
      <el-submenu index="1" v-if="status == 200">
        <template slot="title">
          <span slot="title">创建的歌单</span>
        </template>
        <el-menu-item-group v-for=" plays,index in userplayList " :key=" index">
          <span slot="title" @click="clickMenu(plays.id) ">
            <div class="inline-block wb30">
              <img :src="plays.coverImgUrl+'?param=45y45'" alt="">
            </div>
            <div class="inline-block wb60" >
              <p>{{plays.name | hanziLimit(15)}}</p>
              <p>{{plays.trackCount}}首 </p>
            </div>
          </span>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <el-menu :default-openeds="['1']" class="el-menu-vertical-demo" background-color="transparent" @open="handleOpen"
             @close="handleClose" :collapse="isCollapse">
      <el-submenu index="1" v-if="status == 200">
        <template slot="title">
          <span slot="title">收藏的歌单</span>
        </template>
        <el-menu-item-group v-for=" plays,index in userSubCount " :key=" index">
          <span slot="title" @click="clickMenu(plays.id) ">
            <div class="inline-block wb30">
              <img :src="plays.coverImgUrl+'?param=40y40'" alt="">
            </div>
            <div class="inline-block wb60">
              <p>{{plays.name | hanziLimit(13)}} </p>
              <p>{{plays.trackCount}}首 </p>
            </div>
          </span>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <div class="box-music-card" v-if=" musicPlay != null && musicType == 'mp3' " >
      <div class="best-fit" >
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

    <div class="box-music-card" v-if=" musicPlay != null && musicType == 'fm'  && isFM" >
      <div class="best-fit" @click="current = 2">
        <router-link to="/fm">
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
  import {mapState,mapMutations} from 'vuex'

  export default {

    name: "MusicLeft",
    data() {
      return {
        isCollapse: false,
        current: 1,
        musicPlay: null,
        status: null,
        userSubCount: [],
        userplayList: [],
        isMenuShow:false,
      };
    },
    methods: {
      ...mapMutations({
        changeIsMenus:'changeIsMenus',
        changeIsFM:'changeIsFM',
      }),
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      clickMenu( id ){
        this.$router.push({
            name: 'menu',
            query: {
              id: id,
            }
          }
        );
        this.isMenuShow = false;
        this.changeIsMenus(false);
        this.$nextTick(() => {
          this.isMenuShow = false;
          this.changeIsMenus(true);
        })

      },
      async getUserCount() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        let userSubCountUrl = '/user/subcount';
        let userplayListUrl = "/user/playlist?uid=" + userInfo.userId;
        let userSubCountDatas = await this.$http.get(userSubCountUrl);
        let userplayListDatas = await this.$http.get(userplayListUrl);
        let userSubCountData = userSubCountDatas;
        let userplayListData = userplayListDatas.playlist;
        this.userplayList = userplayListData.slice(0, userSubCountData.createdPlaylistCount)
        this.userSubCount = userplayListData.slice(userSubCountData.createdPlaylistCount, userplayListData.length)
      }
    },
    computed: {
      ...mapState([
        'loginStatus',
        'isFM',
        'musicType'
      ]),
      getMusicPlay() {
        return this.$store.state.musicPlay;
      }
    },
    created: function () {
      switch (this.$route.name ) {
        case 'recommend':
          this.current = 1;
          break;
        case 'fm':
          this.current = 2;
          break;
        case 'djfs':
          this.current = 3;
          break;
        default:
          this.current = 0;
      }

      this.musicPlay = JSON.parse(localStorage.getItem("musicplay"));
      this.status = sessionStorage.getItem('userStatus');
      if (this.status == '200') {
        this.getUserCount();
      }
    },

    watch: {
      loginStatus(status) {
        this.status = status;
        if (this.status == 200) {
          this.getUserCount();
        }
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
