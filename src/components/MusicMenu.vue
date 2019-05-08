<template>
  <div>
    <div class="menu-nav">
      <div class="fl menu-cover">
        <img :src="playlist.coverImgUrl+'?param=195y195'" alt="">
      </div>
      <div class="fl menu-detail">
        <div>
          <span class="menu-song-list">歌单</span>
          <span class="menu-song-name">{{ playlist.name}}</span>
          <div class="fr menu-play-count">
            <div class="fr" style="text-align: right">
            <span>播放数<br>
              {{ playlist.playCount | hanziLimit(3,'number')}}万</span>
            </div>
            <div class="fr menu-line"></div>
            <div class="fr" style="text-align: right">
            <span>歌曲数<br>
            {{ playlist.trackCount}}
            </span>
            </div>
          </div>

          <div class="menu-play-introduce">
            <div class="fl menu-avatar">
              <img :src="user.avatarUrl+'?param=35y35'" alt="">
            </div>
            <div class="fl menu-author">
              <span>{{user.nickname}}</span>
              <span>{{playlist.updateTime | musicmenuDate}}创建</span>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="menu-operation">
          <el-button type="danger" size="mini" icon="iconfont lyd-bofang" @click="playAll">播放全部</el-button>
          <el-button type="danger" size="mini" class="shizi_icon" icon="el-icon-plus"></el-button>
          <el-button size="mini" icon="el-icon-circle-plus-outline">收藏</el-button>
          <el-button size="mini" icon="el-icon-share">分享</el-button>
          <el-button size="mini" icon="el-icon-download">下载全部</el-button>
        </div>
        <div class="menu-intro">
          <div>
            <span>标签：<span v-for="tag,index in playlist.tags" :key="index">  {{ tag }}·</span></span>
          </div>
          <div>
            <span v-if="isShow">简介：{{description | hanziLimit(72) }}</span>
            <span v-if="!isShow">简介：{{description }}</span>
          </div>
          <div class="fr menu-arrow">
            <i class="el-icon-arrow-down" v-if="isShow" @click="isShow = false "></i>
            <i class="el-icon-arrow-up" v-if="!isShow" @click="isShow = true "></i>
          </div>
        </div>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="fl">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="menu-tabs">
        <el-tab-pane label="歌曲列表" name="first">
          <menu-list :menu-data="tracks" ></menu-list>
        </el-tab-pane>
        <el-tab-pane label="评论" name="second">
          <menu-comment :comment-data="comments" :total="commentstotal">
          </menu-comment>
          <div class="clearfix"></div>
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="commentsCurrent"
            :total="commentstotal">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="third">
          <menu-collect :subscribers-data=" subscribers " :type=" type">
          </menu-collect>
          <div class="clearfix"></div>
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="subscribersCurrent"
            :total="commentstotal">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>

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
        comments: [],
        commentstotal: '',
        subscribers: '',
        playlist: [],
        user: '',
        description: '',
        isShow: true,
        activeName: 'first',
        type:'menu'
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
        changeMusicList: 'changeMusicList',
        changeMainScrollTop: 'changeMainScrollTop',
      }),
      handleClick(tab, event) {
        console.log('tab功能');
      },
      playAll() {
        localStorage.removeItem("musicplay");
        localStorage.removeItem("musicPlayList");
        localStorage.setItem("musicPlayList", JSON.stringify(this.tracks));
        localStorage.setItem("musicplay", JSON.stringify(this.tracks[0]));
        this.changeMusicList();
        this.changemusicPlay();
      },
      async getPlaylistComments(url) {
        let playlistCommentData = await this.$http.get(url);
        this.commentstotal = playlistCommentData.total;
        this.comments = playlistCommentData.comments;
      },
      async getPlaylistSubscribers(url) {
        let playlistSubscribersData = await this.$http.get(url);
        console.log(playlistSubscribersData)
        this.subscribers = playlistSubscribersData.subscribers;
      },
      async getPlayListDetail(url) {
        let playListDetailData = await this.$http.get(url);
        this.playlist = playListDetailData.playlist;
        this.user = playListDetailData.playlist.creator;
        this.description = this.playlist.description == null ? " 暂无简介 " : this.playlist.description;
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
            lrc: '/lyric?id=' + item.id,
            url: 'https://music.163.com/song/media/outer/url?id=' + item.id + '.mp3',
            pic: item.al.picUrl,
            type:'mp3'
          }
        });
        this.tracks = tracks;
      },

      commentsCurrent(index) {
        this.changeMainScrollTop(300 + (index / 10));
        let playlistCommentUrl = '/comment/playlist?id=' + this.$route.query.id + '&limit=20&offset=' + index;
        this.getPlaylistComments(playlistCommentUrl)
      },
      subscribersCurrent( index){
        this.changeMainScrollTop(300 + (index / 10));
        let playlistSubscribersUrl = '/playlist/subscribers?id=' + this.$route.query.id + '&limit=80&offset=' + index;
        this.getPlaylistSubscribers(playlistSubscribersUrl);
      }
    },
    created() {
      let playlistDetailUrl = '/playlist/detail?limit=100&id=' + this.$route.query.id;
      let playlistCommentUrl = '/comment/playlist?id=' + this.$route.query.id;
      let playlistSubscribersUrl = '/playlist/subscribers?id=' + this.$route.query.id +'&limit=80';

      this.getPlayListDetail(playlistDetailUrl);
      this.getPlaylistComments(playlistCommentUrl);
      this.getPlaylistSubscribers(playlistSubscribersUrl);
    },
  }
</script>

<style lang="less">
  .menu-nav {
    height: 240px;
    position: relative;
    margin-top: 30px;
  }

  .menu-cover {
    width: 195px;
    height: 195px;
    margin: 0 30px;
    border: 1px solid;

    img {
      width: 195px;
      height: 195px;
    }
  }

  .menu-song-list {
    display: inline-block;
    width: 30px;
    height: 20px;
    border: 1px solid rgba(162, 0, 0, 0.69);
    text-align: center;
    color: rgba(162, 0, 0, 0.69);
    position: relative;
    top: -2px;
    padding: 3px;
  }

  .menu-song-name {
    font-size: 22px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  .menu-play-count {
    position: absolute;
    top: 43px;
    right: 20px;
    color: #262d3375;
    font-size: 12px;

    .menu-line {
      width: 1px;
      height: 35px;
      background-color: rgba(38, 45, 51, 0.11);
      margin: 0 5px;
    }
  }

  .menu-play-introduce {
    margin-top: 5px;

    .menu-avatar {
      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }
    }

    .menu-author {
      margin-top: 5px;
      padding: 5px;
      color: #262d3375;
      font-size: 14px;
    }

    span:first-child {
      padding-right: 10px
    }
  }

  .menu-operation {
    button.shizi_icon {
      margin-left: 0;
      padding: 9px 5px;
      border-radius: 0 4px 4px 0;
      border-left: 1px solid rgba(226, 226, 226, 0.08);
      position: relative;
      top: -1px;
      left: -5px;
    }

    .el-button span {
      margin-left: 5px;
    }
  }

  .menu-intro {
    width: 500px;
    margin-top: 10px;
    position: relative;
  }

  .menu-arrow {
    position: absolute;
    font-size: 20px;
    top: 18px;
    right: -25px;

    i {
      position: relative;
    }
  }

</style>
