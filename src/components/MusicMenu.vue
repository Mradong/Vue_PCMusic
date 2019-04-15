<template>
  <div>
    <div class="musicmenu_nav" style="height:300px;position: relative">
      <div class="fl " style="width: 195px; height: 195px; margin: 40px 30px;border: 1px solid;">
        <img :src="playlist.coverImgUrl" alt="" style="width:195px;height: 195px;">
      </div>
      <div class="fl" style=" margin: 40px 10px;">
        <div>
          <span class="musicmenu_span">歌单</span>
          <span style="font-size: 22px;font-family: Arial">{{ playlist.name}}</span>
          <div class="fr" style="position: absolute;top: 43px;right: 20px;color: #262d3375;font-size: 12px">
            <div class="fr" style="text-align: right">
            <span>播放数<br>
              {{ playlist.playCount | hanziLimit(3,'number')}}万</span>
            </div>
            <div class="fr"
                 style="width: 1px;height: 35px;background-color:rgba(38, 45, 51, 0.11);margin: 0 5px;"></div>
            <div class="fr" style="text-align: right">
            <span>歌曲数<br>
            {{ playlist.trackCount}}
            </span>
            </div>
          </div>

          <div style="margin-top: 5px;">
            <div class="fl">
              <img :src="user.avatarUrl" alt="" style="width: 35px; height: 35px;border-radius: 50%">
            </div>

            <div class="fl" style="margin-top: 5px; padding: 5px;color: #262d3375;font-size: 14px;">
              <span style="padding-right: 10px">{{user.nickname}}</span>
              <span>{{playlist.updateTime | musicmenuDate}}创建</span>
            </div>
          </div>
        </div>
        <div style="clear:both;"></div>
        <div>
          <el-button type="danger" size="mini" icon="iconfont lyd-bofang" @click="playAll">播放全部</el-button>
          <el-button type="danger" size="mini" class="shizi_icon" icon="el-icon-plus"></el-button>
          <el-button size="mini" icon="el-icon-circle-plus-outline">收藏</el-button>
          <el-button size="mini" icon="el-icon-share">分享</el-button>
          <el-button size="mini" icon="el-icon-download">下载全部</el-button>
        </div>
        <div style="width:500px;margin-top: 10px">
          <div><span>标签：<span style="color: #0086b3" v-for="tag,index in playlist.tags" :key="index">  {{ tag }}·</span></span>
          </div>
          <div><span>简介：{{description | hanziLimit(50)}}</span><span></span></div>
          <div class="fr" style="position: relative;top: -40px;font-size: 20px;">
            <i class="el-icon-arrow-down" style="position: absolute;" v-if="isShow" @click="isShow =!isShow "></i>
            <i class="el-icon-arrow-up" style="position: absolute;" v-if="!isShow" @click="isShow =!isShow "></i>
          </div>
          <div v-if="!isShow">{{hideDescription}}</div>
        </div>
      </div>
    </div>
    <div class="musicmenu_list">
      <el-table
        stripe
        @row-dblclick="dblclick"
        :data="tracks.filter(data => !search || data.singer.toLowerCase().includes(search.toLowerCase()) || data.name.toLowerCase().includes(search.toLowerCase())|| data.alname.toLowerCase().includes(search.toLowerCase()) )"
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
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'

  export default {
    name: "MusicMenu",
    data() {
      return {
        tracks: [],
        search: '',
        playlist: [],
        user: '',
        description: '',
        hideDescription: '',
        isShow: true,
      }
    },
    methods: {
      ...mapMutations({
        changemusicPlay: 'changemusicPlay',
        changeMusicList:'changeMusicList',
      }),
      playAll(){
        localStorage.removeItem( "musicplay");
        localStorage.removeItem( "musicPlayList");
        localStorage.setItem("musicPlayList", JSON.stringify(this.tracks));
        localStorage.setItem("musicplay", JSON.stringify(this.tracks[0]));
        this.changeMusicList();
        this.changemusicPlay();
      },
      dblclick(e) {

        localStorage.setItem("musicplay", JSON.stringify(this.tracks[e.i-1]));
        this.changemusicPlay();
      }
    },
    created() {
      let playlistUrl = '/playlist/detail?limit=100&id=' + this.$route.query.id;
      //获取歌单详
      this.$axios.get(playlistUrl).then((response) => {
        this.playlist = response.data.playlist;
        this.user = response.data.playlist.creator;
        this.description = this.playlist.description;
        this.hideDescription = this.playlist.description.slice(50);
        console.log(this.playlist.tracks)
        const tracks = this.playlist.tracks.map((item, index) => {
          return {
            i: (index + 1).toString().padStart(2, '0'),
            name: item.name,
            time: this.$moment(item.dt).format('mm：ss'),
            id: item.id,
            alname: item.al.name.slice(0, 10).length >= 10 ? item.al.name.slice(0, 10) + '..' : item.al.name,
            alid: item.al.id,
            singer: item.ar[0].name,
            arid: item.ar[0].id,
            lrc:'/lyric?id='+ item.id,
            url:'https://music.163.com/song/media/outer/url?id='+item.id+'.mp3',
            pic:item.al.picUrl,
          }
        });
        this.tracks = tracks;

      }).catch((error) => {
        console.log(error);
      });

    },
  }
</script>

<style lang="less">
  .musicmenu_nav {
    button.shizi_icon {
      margin-left: 0;
      padding: 9px 5px;
      border-radius: 0 4px 4px 0;
      border-left: 1px solid rgba(226, 226, 226, 0.08);
      position: relative;
      top: -1px;
      left: -5px;
    }
  }

  .el-button span {
    margin-left: 5px;
  }

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
    top: -54px;
    right: 163px;
    border: 0 !important;
  }

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden !important;
  }

  .el-table, .el-table__header-wrapper, .el-table th div, .el-table th, .el-table .cell, .el-table th div {
    overflow: inherit !important;

  }

  .el-table th div {
    width: 150px;
  }
</style>
<style scoped lang="less">
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
