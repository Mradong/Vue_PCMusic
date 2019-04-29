<template>
  <div class="musicmenu_list">
    <el-table
      stripe
      @row-dblclick="dblclick"
      :data="menuData.filter(data => !search || data.singer.toLowerCase().includes(search.toLowerCase()) || data.name.toLowerCase().includes(search.toLowerCase())|| data.alname.toLowerCase().includes(search.toLowerCase()) )"
      header-cell-class-name="header_cell"
      :default-sort="{prop: 'date', order: 'descending'}"
      style="width: 100%">
      <el-table-column
        width="50"
        label=""
        prop="i">
      </el-table-column>
      <el-table-column
        label="操作"
        width="80">
        <template slot-scope="scope">
          <i class="lyd-xihuan1 iconfont"></i> <i class="lyd-xiazaiguanli-xiazai iconfont" style="font-size: 18px"></i>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="250"
        label="音乐标题"
        prop="name">
      </el-table-column>
      <el-table-column
        sortable
        width="150"
        label="歌手"
        prop="singer">
      </el-table-column>
      <el-table-column
        sortable
        width="200"
        label="专辑"
        prop="alname">
      </el-table-column>
      <el-table-column
        sortable
        label="时长"
        prop="time">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="small "
            placeholder="输入关键字搜索"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
    export default {
      name: "MusicMenuList",
      props:['menuData'],
      data() {
        return {
          search: '',
        }
      },
      methods:{
        ...mapMutations({
          changemusicPlay: 'changemusicPlay',
        }),
        dblclick(e) {
          localStorage.setItem("musicplay", JSON.stringify(e));
          this.changemusicPlay();
        }
      }
    }
</script>

<style lang="less">

  .header_cell {
    border: 1px solid #ebeef5;
    padding: 0 !important;
    .cell {
      line-height: 34px;
      .caret-wrapper {
        float: right;
      }
    }
  }
  .has-gutter tr th:nth-child(7) {
    position: relative;
    top: -40px;
    right: 163px;
    border: 0 !important;
  }

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden !important;
  }

  .el-table, .el-table__header-wrapper, .el-table th div, .el-table th, .el-table .cell, .el-table th div ,.el-tabs__content{
    overflow: inherit !important;

  }
  .el-table th div {
    width: 150px;
  }
  .el-tabs__header{
    padding: 0 80px;
    margin: 0 ;
    .el-tabs__nav-wrap{
      &:after {
        height: 0;
      }
    }
  }
  .el-tabs__item.is-active,.el-tabs__item:hover{
    color: #ff101a;
  }
  .el-tabs__active-bar{
    background-color: #fa483e;
    height: 5px;
  }
  span.musicmenu_span {
    display: inline-block;
    width: 30px;
    height: 20px;
    border: 1px solid rgba(162, 0, 0, 0.69);
    text-align: center;
    color: rgba(162, 0, 0, 0.69);
    position: relative;
    top: -2px;
    padding: 1px;
  }

</style>
