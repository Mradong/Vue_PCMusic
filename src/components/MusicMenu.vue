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
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="">
        <el-tab-pane label="歌曲列表" name="first">
          <menu-list :menu-data="tracks"></menu-list>
        </el-tab-pane>
        <el-tab-pane label="评论" name="second">
          <menu-comment :comment-data="comments" :total="total">
          </menu-comment>
          <div class="clearfix"></div>
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="commentsCurrent"
            :total="total">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="third">
          <menu-collect>

          </menu-collect>
        </el-tab-pane>
      </el-tabs>
    </template>


  </div>
</template>

<script>

  import {mapMutations} from 'vuex'
  import menuList from './MusicMenuList'
  import menuComment from './MusicMenuComment'
  import menuCollect from './MusicMenuCollect'

  export default {
    name: "MusicMenu",
    data() {
      return {
        tracks: [],
        comments:[],
        total:'',
        playlist: [],
        user: '',
        description: '',
        hideDescription: '',
        isShow: true,
        activeName: 'first',
      }
    },
    components: {
      menuList,
      menuComment,
      menuCollect
    },
    methods: {
      ...mapMutations({
        changemusicPlay: 'changemusicPlay',
        changeMusicList:'changeMusicList',
        changeMainScrollTop:'changeMainScrollTop',
      }),
      handleClick(tab, event) {
        console.log(tab, event);
      },
      playAll(){
        localStorage.removeItem( "musicplay");
        localStorage.removeItem( "musicPlayList");
        localStorage.setItem("musicPlayList", JSON.stringify(this.tracks));
        localStorage.setItem("musicplay", JSON.stringify(this.tracks[0]));
        this.changeMusicList();
        this.changemusicPlay();
      },
      async getPlaylistComments( url ){
        let playlistCommentData = await this.$http.get( url );
        this.total = playlistCommentData.total;
        this.comments =playlistCommentData.comments;
      },
      commentsCurrent( index){
        this.changeMainScrollTop(300 +( index/10));
        let playlistCommentUrl = '/comment/playlist?id=' + this.$route.query.id +'&limit=20&offset='+ index;
        this.getPlaylistComments( playlistCommentUrl )

      }
    },
    created() {
      const getPlayListDetail = async () => {
        try {
          let playlistUrl = '/playlist/detail?limit=100&id=' + this.$route.query.id;
          let playlistCommentUrl = '/comment/playlist?id=' + this.$route.query.id;

          let playListDetailData = await this.$http.get(playlistUrl);
          this.playlist = playListDetailData.playlist;
          this.user = playListDetailData.playlist.creator;
          this.description = this.playlist.description == null ? " 暂无简介 ": this.playlist.description;
          this.hideDescription = this.playlist.description == null ? "": this.playlist.description.slice(50);
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
          this.getPlaylistComments( playlistCommentUrl )
        } catch (e) {
          console.log(e)
        }
      }
      getPlayListDetail();
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


</style>
<style scoped lang="less">

</style>
