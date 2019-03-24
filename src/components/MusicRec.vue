<template>
  <div style="height: 1000px">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="个性推荐" name="first">
        <rec-per></rec-per>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="second">歌单</el-tab-pane>
      <el-tab-pane label="主播电台" name="third">主播电台</el-tab-pane>
      <el-tab-pane label="排行榜" name="fourth">排行榜</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import recPer from './MusicRecPer'
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    components: {
      recPer
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>

<style>
  .el-tabs__nav{
    left: 25%;
  }
  .el-tabs__item.is-active{
    color: #ff3c44;

  }
  .el-tabs__active-bar{
    background-color: #ff3c44;
  }
</style>
