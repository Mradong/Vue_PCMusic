<template>
  <div style=" width:1020px; margin: 0 auto;">
    <el-container>
      <el-header>
        <music-nav></music-nav>
      </el-header>

      <el-container v-if=" !this.$store.state.isPlayHtml ">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <music-left></music-left>
        </el-aside>

        <el-main v-if=" this.$store.state.isMenus" ref="mainWrapper">
          <router-view v-if="this.$store.state.isRouterAlive" ref="viewWrapper"></router-view>
        </el-main>
      </el-container>

      <el-container v-if=" this.$store.state.isPlayHtml ">
        <router-view></router-view>
      </el-container>


      <el-footer v-if="!this.$store.state.isMvPlay">
        <music-foot></music-foot>
      </el-footer>

      <el-footer v-if="this.$store.state.isMvPlay" style="display: none">
      </el-footer>

    </el-container>
  </div>
</template>

<script>
  import musicLeft from './MusicLeft.vue'
  import musicFoot from './MusicFoot.vue'
  import musicRec from './MusicRec.vue'
  import musicNav from './MusicNav'
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        scrollNum: 1,
      };
    },
    components: {
      musicLeft,
      musicFoot,
      musicRec,
      musicNav
    },
    methods: {
      ...mapMutations({
        changeNewMvs: 'changeNewMvs',
        changeLoginStatus: 'changeLoginStatus'
      }),
    },
    mounted() {
      let that = this;
      if (this.$route.name == 'djfs') {
        this.$refs.mainWrapper.$el.addEventListener('scroll', () => {
          let scrollTop = parseInt(this.$refs.mainWrapper.$el.scrollTop) - 41;
          let scrollNum = 2050 * (this.scrollNum) - 580;
          if (scrollTop == scrollNum) {
            this.scrollNum++;
            let newMvUrl = '/mv/first?limit=' + 20 * this.scrollNum;
            async function getNewMv() {
              try {
                let newMvData = await that.$http.get(newMvUrl);
                let newMvs = [];
                newMvs.push(newMvData.data);
                that.changeNewMvs(newMvs)
              } catch (e) {
                console.log(e)
              }
            }
            getNewMv();
          }

        }, false)
      }
    },
    created: function () {
      const getuserStatus = async () => {
        try {
          let time = new Date();
          let userStatusUrl = '/login/status?timestamp=' + this.$moment(time).valueOf();
          let userStatusData = await this.$http.get(userStatusUrl);
          if (userStatusData.code == 200) {
            sessionStorage.setItem("userStatus", 200);
            this.changeLoginStatus();
          }
        } catch (e) {
          console.log(e)
          sessionStorage.setItem("userStatus", 301);
          localStorage.removeItem("userInfo");
          this.changeLoginStatus();
        }
      }
      getuserStatus();
    },
  };
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #C62F2F;
    color: #333;
    text-align: center;
    height: 54px !important;
    padding: 0;
    padding-top: 12px;
  }

  .el-footer {
    border: 1px solid rgba(6, 12, 6, 0.12);
    background-color: #ffffff;
    box-shadow: 0 2px 2px #aaaaaa;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;

  }

  .el-main {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    height: 580px;
    overflow-scrolling: touch;
    padding: 0;
  }

  .el-main::-webkit-scrollbar { /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  .el-main::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 10px;
    background: rgba(197, 163, 42, 0.16);
  }

  .el-main::-webkit-scrollbar-track { /*滚动条里面轨道*/
    background: #EDEDED;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
</style>
