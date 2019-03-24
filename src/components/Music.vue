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
        <el-main>
          <router-view v-if="this.$store.state.isRouterAlive"></router-view>
        </el-main>
      </el-container>

      <el-container v-if=" this.$store.state.isPlayHtml ">
        <router-view></router-view>
      </el-container>


      <el-footer  v-if="!this.$store.state.isMvPlay">
        <music-foot ></music-foot>
      </el-footer>

      <el-footer  v-if="this.$store.state.isMvPlay" style="display: none">
      </el-footer>

    </el-container>
  </div>
</template>

<script>
  import musicLeft from './MusicLeft.vue'
  import musicFoot from './MusicFoot.vue'
  import musicRec from './MusicRec.vue'
  import musicNav from './MusicNav'

  export default {
    data() {
      return {};
    },
    components: {
      musicLeft,
      musicFoot,
      musicRec,
      musicNav
    },
    methods: {},
    mounted() {
    },
    beforeRouteLeave(to, from, next) {

    },
    created: function () {
      if (localStorage.getItem("musicplay") == null) {
        localStorage.setItem("musicplay", '')
      }
    },
    watch: {
      $route(to, from) {
        console.log()
      }
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
