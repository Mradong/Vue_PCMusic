<template>
  <div style="margin: 20px">
    <div class="song_menu">
      <el-row type="flex" class="row-bg">
        <el-col :span="22">
          <div class="grid-content bg-purple fz20">推荐歌单</div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple-light">更多></div>
        </el-col>
      </el-row>
    </div>
    <div class="song_content">
      <ul>
        <li v-for="(item,index) in personalizedList" :key="index" v-if='index<10'>
          <router-link :to="{name:'menu', query:{id: item.id}}"><img :src="item.picUrl+'?param=140y140'" alt=""
                                                                     style="width: 100%"></router-link>
          <router-link :to="{name:'menu', query:{id: item.id}}"><p> {{item.name}}</p></router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MusicMenus",
    data() {
      return {}
    },
    created: function () {
      let musicMenusUrl = '/top/playlist?limit=20';
      //轮播图
      this.$axios.get(musicMenusUrl).then((response) => {
        console.log(response.data)
      }).catch((error) => {
        console.log(error);
      });
    }
  }
</script>

<style scoped>
  .song_menu {
    border-bottom: 1px solid rgba(6, 12, 6, 0.22);
  }

  .song_content {
    margin-top: 10px;
  }

  .song_content > ul > li {
    margin: 5px;
    width: 140px;
    float: left;
    height: 195px;
    font-size: 12px;
  }

  .new_song {
    width: 96%;
    height: 300px;
    border: 1px solid #d7d7d7;
    margin: 10px;
    background-color: rgba(226, 226, 226, 0.14);
  }

</style>
