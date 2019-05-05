<template>
  <div>
    <div class="albums-details fl">
      <div class="albums-cover fl">
        <img :src="albumsDetails.blurPicUrl+'?param=195y195'" alt="">
      </div>
      <div class="albums-detail fl">
        <span class="albums-type">专辑</span>
        <span class="albums-title">{{ albumsDetails.name }}<span>({{albumsAlias[0]}}) </span> </span>
        <div class="clearfix"></div>
        <div class="menu-operation">
          <el-button type="danger" size="mini" icon="iconfont lyd-bofang" @click="playAll">播放全部</el-button>
          <el-button type="danger" size="mini" class="shizi_icon" icon="el-icon-plus"></el-button>
          <el-button size="mini" icon="el-icon-circle-plus-outline">收藏</el-button>
          <el-button size="mini" icon="el-icon-share">分享</el-button>
          <el-button size="mini" icon="el-icon-download">下载全部</el-button>
        </div>
      </div>
      <p>歌手：<span>{{albumsArtist.name }}</span></p>
      <p>时间：<span>{{albumsDetails.publishTime | musicmenuDate }}</span></p>
    </div>
    <div class="clearfix"></div>
    <div class="fl">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="menu-tabs">
        <el-tab-pane label="歌曲列表" name="first">
          <menu-list :menu-data="albumSongs"></menu-list>
        </el-tab-pane>
        <el-tab-pane label="评论" name="second">
          <menu-comment :comment-data="albumsComments" :total="albumsCommentstotal">
          </menu-comment>
          <div class="clearfix"></div>
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="albumsCommentsCurrent"
            :total="albumsCommentstotal">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="专辑详情" name="third">
          <menu-collect :subscribers-data=" albumsDescription " :type=" type ">
          </menu-collect>

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
    name: "MusicAlbums",
    data() {
      return {
        activeName: 'first',
        albumsDetails: {},
        albumSongs: [],
        albumsComments: [],
        albumsCommentstotal: '',
        albumsDescription: '',
        type: 'album',
        albumsAlias: [],
        albumsArtist: {},
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
      playAll() {
        localStorage.removeItem("musicplay");
        localStorage.removeItem("musicPlayList");
        localStorage.setItem("musicPlayList", JSON.stringify(this.albumSongs));
        localStorage.setItem("musicplay", JSON.stringify(this.albumSongs[0]));
        this.changeMusicList();
        this.changemusicPlay();
      },
      async getAlbums(url) {
        let albumData = await this.$http.get(url);
        this.albumsDetails = albumData.album;
        this.albumsAlias = this.albumsDetails.alias;
        this.albumsArtist = this.albumsDetails.artist;

        this.albumSongs = albumData.songs;
        this.albumsDescription = albumData.album.description;
        const albumSong = this.albumSongs.map((item, index) => {
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
          }
        });

        this.albumSongs = albumSong;
      },
      albumsCommentsCurrent(index) {
        this.changeMainScrollTop(300 + (index / 10));
        let albumCommentsUrl = '/comment/album?id=' + this.$route.query.id + '&limit=20&offset=' + index;
        this.getAlbumsComments(albumCommentsUrl)
      },
      async getAlbumsComments(url) {
        let albumsCommentsData = await this.$http.get(url);
        this.albumsCommentstotal = albumsCommentsData.total;
        this.albumsComments = albumsCommentsData.comments;
      },
    },
    created() {
      let albumUrl = '/album?id=' + this.$route.query.id;
      let albumCommentsUrl = '/comment/album?id=' + this.$route.query.id;
      this.getAlbums(albumUrl);
      this.getAlbumsComments(albumCommentsUrl)
    }
  }
</script>

<style scoped lang="less">
  .albums-details {
    margin: 30px 0;

    .albums-cover {
      width: 195px;
      height: 195px;
      margin: 0 30px;
    }

    p {
      line-height: 28px;

      span {
        color: #55555587;
      }
    }
  }

  .albums-detail {
    margin-bottom: 20px;

    .albums-type {
      display: inline-block;
      width: 30px;
      height: 20px;
      text-align: center;
      background-color: rgba(226, 46, 27, 0.96);
      color: white;
      position: relative;
      top: -2px;
      padding: 3px;
    }

    .albums-title {
      font-size: 22px;
      font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;

      span {
        color: #55555587;
      }
    }

    .menu-operation {
      margin-top: 20px;

      .shizi_icon {
        margin-left: 0;
        padding: 9px 5px;
        border-radius: 0 4px 4px 0;
        border-left: 1px solid rgba(226, 226, 226, 0.08);
        position: relative;
        top: -1px;
        left: -5px;
      }
    }
  }

</style>
