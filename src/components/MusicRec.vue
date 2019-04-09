<template>
  <div style="height: 1000px">
    <el-tabs v-model="musicRecActiveName" @tab-click="handleClick">
      <el-tab-pane label="个性推荐" name="0">
        <rec-per></rec-per>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="1">
        <menus></menus>
      </el-tab-pane>
      <el-tab-pane label="主播电台" name="2">主播电台</el-tab-pane>
      <el-tab-pane label="排行榜" name="3">排行榜</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import recPer from './MusicRecPer'
  import menus from './MusicMenus'
  import {mapState, mapMutations} from 'vuex'

  export default {
    data() {
      return {};
    },
    computed: {
      ...mapState([
        'musicRecActiveName'
      ]),
    },
    created() {
    },
    components: {
      recPer,
      menus
    },
    methods: {
      ...mapMutations({
        changeRecActiveName: 'changeRecActiveName'
      }),
      handleClick(tab, event) {
        this.changeRecActiveName(tab.index)
      }
    },
    watch:{

    }
  };
</script>

<style>
  .el-tabs__nav {
    left: 25%;
  }

  .el-tabs__item.is-active {
    color: #ff3c44;

  }

  .el-tabs__active-bar {
    background-color: #ff3c44;
  }
</style>
