<template>
  <div style="padding: 20px" class="musuc_mv">
    <div class="music_mv_l fl" style="width: 690px">
      <div class="music_mv_play">
        <div style="margin-bottom: 5px" v-if="type =='mv'">
          <i class="el-icon-arrow-left" @click="$router.go(-1)"></i>
          <span class="span_mv">mv</span>
          <span style="font-size: 18px;">{{ mvdetails.name }}</span>
          <span>{{ mvdetails.artistName}}</span>
        </div>
        <div style="margin-bottom: 5px" v-if="type =='djfs'">
          <i class="el-icon-arrow-left" @click="$router.go(-1)"></i>
          <span class="span_mv">视频</span>
          <span style="font-size: 18px;">{{ mvdetails.title }}</span>
          <span>{{ creator.nickname}}</span>
        </div>

        <VueXgplayer :config="config" :rootStyle="rootStyle" @player="Player = $event"/>
        <ul class="song-cd-iocn" v-if="type =='mv'">
          <li><i class=" iconfont lyd-xihuan2"></i>喜欢({{ mvdetails.likeCount}})</li>
          <li><i class=" iconfont lyd-yinle2"></i>收藏({{ mvdetails.subCount}})</li>
          <li><i class=" iconfont lyd-pengyou1"></i>分享({{ mvdetails.shareCount}})</li>
          <li><i class=" iconfont lyd-xiazaiguanli-xiazai"></i>下载</li>
        </ul>
        <ul class="song-cd-iocn" v-if="type =='djfs'">
          <li><i class=" iconfont lyd-xihuan2"></i>喜欢({{ mvdetails.likeCount}})</li>
          <li><i class=" iconfont lyd-yinle2"></i>收藏({{ mvdetails.subscribeCount}})</li>
          <li><i class=" iconfont lyd-pengyou1"></i>分享({{ mvdetails.praisedCount}})</li>
          <li><i class=" iconfont lyd-xiazaiguanli-xiazai"></i>下载</li>
        </ul>

      </div>
      <div class="music-play-bottom" style="margin-top:110px;">
        <div class="Song-reviews">
          <div class="user-ratings" style="margin-bottom:30px;">
            <div class="music-user">评论</div>
            <el-input
              prefix-icon="el-icon-edit"
              placeholder="发表评论"
            >
            </el-input>
          </div>
          <ul class="brilliant hot-comments">
            <h4>精彩评论</h4>
            <li class="fl" v-for="item,index in hotComments " :key="index">
              <div class="fl brilliant-img">
                <img :src="item.user.avatarUrl" alt="">
              </div>
              <div class="fl brilliant-content">
                <span style="color: skyblue">{{ item.user.nickname}} </span> <span
                style="font-size: 18px;font-family: Arial">:</span> {{item.content }}
                <div style="padding-top: 8px"><span
                  style="font-size: 12px;color: #909399">{{ item.time | convertDate }}</span></div>
              </div>
            </li>
          </ul>
          <div class="clearfix"></div>
          <ul class="brilliant" style="margin-top: 30px">
            <h4>最新评论({{total}})</h4>
            <li class="fl" v-for="item,index in mvComment " :key="index">
              <div class="fl brilliant-img">
                <img :src="item.user.avatarUrl" alt="">
              </div>
              <div class="fl brilliant-content">
                <span style="color: skyblue">{{ item.user.nickname}} </span> <span
                style="font-size: 18px;font-family: Arial">:</span> {{item.content }}
                <div style="padding-top: 8px"><span
                  style="font-size: 12px;color: #909399">{{ item.time | convertDate }}</span></div>
              </div>
            </li>
          </ul>

        </div>

      </div>
    </div>

    <div class="music_mv_r fl" style="width: 250px;margin-left: 20px;" v-if="type =='mv'">
      <div class="mv-detail" style="width: 250px">
        <div class="music-user">视频介绍</div>
        <div style="color: #9a6e3a;font-size: 12px; margin: 5px 0 15px">
          <span style="padding-right: 15px">发布时间:{{mvdetails.publishTime}}</span>
          <span>播放次数:{{ mvdetails.playCount}}</span>
        </div>
        <div style="font-size: 12px;">
          <h2>{{ mvdetails.briefDesc}}</h2>
          <p>{{ mvdetails.desc}}</p>
        </div>
      </div>
      <div class="hit-music" style="margin-top:30px ">
        <div class="music-user">相关推荐</div>
        <div class="sim-song" style="margin-top: 20px">
          <ul>
            <li v-for=" item,index in mvSimi" :key="index" @click="cutVideo(index)"
                style="width: 240px; height: 80px; display: block;margin-bottom: 5px">
              <div class="fl" style="width: 120px;height: 70px; cursor: pointer">
                <img :src="item.cover+'?param=120y70'" alt="">
              </div>
              <div class="fr" style="margin:3px 0 010px;width: 110px">
                <p style="font-size: 14px;line-height: 16px;">{{item.name| hanziLimit(12)}}</p>
                <span style="font-size: 12px;color: #555555">{{ item.duration | mvDate}}</span>
                <p style="font-size: 12px;color: #555555">by {{item.artistName | hanziLimit(10)}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="music_mv_r fl" style="width: 250px;margin-left: 20px;" v-if="type =='djfs'">
      <div class="mv-detail" style="width: 250px">
        <div class="music-user">视频介绍</div>
        <div style="color: #9a6e3a;font-size: 12px; margin: 5px 0 15px">
          <span style="padding-right: 15px">发布时间:{{mvdetails.publishTime | musicmenuDate}}</span>
          <span>播放次数:{{ mvdetails.playTime}}</span>
        </div>
        <div style="font-size: 12px;">
          <h2>{{ mvdetails.briefDesc}}</h2>
          简介：
          <p v-for=" item,index in viodDesc" :key="index"> {{item}}</p>
        </div>
      </div>

      <div class="hit-music" style="margin-top:30px ">
        <div class="music-user">相关推荐</div>
        <div class="sim-song" style="margin-top: 20px">
          <ul>
            <li v-for=" item,index in mvSimi" :key="index" @click="cutVideo(index)"
                style="width: 240px; height: 80px; display: block;margin-bottom: 5px">
              <div class="fl" style="width: 120px;height: 70px; cursor: pointer">
                <img :src="item.coverUrl+'?param=120y70'" alt="">
              </div>
              <div class="fr" style="margin:3px 0 010px;width: 110px">
                <p style="font-size: 14px;line-height: 16px;">{{item.title| hanziLimit(12)}}</p>
                <span style="font-size: 12px;color: #555555">{{ item.duration | mvDate}}</span>
                <p style="font-size: 12px;color: #555555">by {{item.creator[0].userName | hanziLimit(8)}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fmt from '@/assets/imges/fmt.jpg'
  import loading from '@/assets/imges/loading.jpg'
  import {mapMutations} from 'vuex'

  export default {
    name: "MusicVideo",
    data() {
      return {
        config: {
          id: 'vs',
          url: [],
          playbackRate: [0.5, 0.75, 1, 1.5, 2],
          keyShortcut: 'on',
          poster: fmt,
          autoplay: false,
          width: 690,
          height: 410,
          type: '',
        },
        enterLogo: { //视频加载页logo
          url: loading,
          width: 231,
          height: 42
        },
        rootStyle: {
          backgroundColor: 'rgba(0,0,0,0.87)'
        },
        isPlayer: true,
        resourceReady: [],
        Player: null,
        mvdetails: [],
        mvComment: [],
        mvSimi: [],
        creator: {},
        viodDesc: [],
        hotComments: [],
        total: '',
      };
    },
    created() {
      this.type = this.$route.query.type;
      switch (this.$route.query.type) {
        case 'mv':
          let mvUrl = '/mv/detail?mvid=' + this.$route.query.id;
          let mvComment = '/comment/mv?id=' + this.$route.query.id;
          let mvSimi = '/simi/mv?mvid=' + this.$route.query.id;
          //MV详情获取
          this.$axios.get(mvUrl).then((response) => {
            this.mvdetails = response.data.data;
            for (let [key, val] of Object.entries(this.mvdetails.brs)) {
              this.config.url.push({src: val, type: 'video/mp4'});
              this.resourceReady.push({name: key + 'P', url: val})
            }
          }).catch((error) => {
            console.log(error);

          });
          //MV评论获取
          this.$axios.get(mvComment).then((response) => {
            this.total = response.data.total;
            this.hotComments = response.data.hotComments;
            this.mvComment = response.data.comments;
          }).catch((error) => {
            console.log(error);
          });
          //相关MV获取
          this.$axios.get(mvSimi).then((response) => {
            this.mvSimi = response.data.mvs;
          }).catch((error) => {
            console.log(error);
          });
          break;
        case 'djfs':
          let djfsUrl = '/video/detail?id=' + this.$route.query.id;
          let djfsPlayUrl = '/video/url?id=';
          let relatedUrl = '/related/allvideo?id=';
          let commentUrl = '/comment/video?id=';
          //MV详情获取
          this.$axios.get(djfsUrl).then((response) => {
            this.mvdetails = response.data.data;
            console.log(response.data.data.vid)
            this.creator = response.data.data.creator;
            if (response.data.data.description == null) {
              this.viodDesc = ['暂无详情']
            } else {
              this.viodDesc = response.data.data.description.split("\n")
            }

            console.log(this.mvdetails)

            return (response.data.data.vid)
          }).then((vid) => {
            //请求歌曲链接
            this.$axios.get(djfsPlayUrl + vid).then((response) => {
              this.config.url.push({src: response.data.urls[0].url, type: 'video/mp4'});
            }).catch((error) => {
              console.log(error);
            });
            //请求相关视频
            this.$axios.get(relatedUrl + vid).then((response) => {
              this.mvSimi = response.data.data;
              console.log(this.mvSimi)
            }).catch((error) => {
              console.log(error);
            });
            //评论详情
            this.$axios.get(commentUrl + vid).then((response) => {
              this.hotComments = response.data.hotComments;
              this.mvComment = response.data.comments;
            }).catch((error) => {
              console.log(error);
            });

          }).catch((error) => {
            console.log(error);
          });

          break;
      }
    },
    methods: {
      ...mapMutations({
        changeIsPlayHtml: 'changeIsPlayHtml'
      }),
      clickVideoMusic() {
        this.isPlayer = false;
        this.changeIsPlayHtml(false);
        this.$nextTick(() => {
          this.isPlayer = false;
          this.changeIsPlayHtml(true);
        })
      },
      cutVideo(index) {
        switch (this.$route.query.type) {
          case 'mv':
            this.$router.push({
                name: 'mv',
                query: {
                  id: this.mvSimi[index].id,
                  type: 'mv'
                }
              }
            );
            break;
          case 'djfs':
            this.$router.push({
                name: 'mv',
                query: {
                  id: this.mvSimi[index].vid,
                  type: 'djfs'
                }
              }
            );
            break;
        }


        this.clickVideoMusic();
      }

    },
    mounted() {

    },
    watch: {
      $route(to, from) {
        if (to.query.id != from.query.id) {
          this.clickVideoMusic();
        }
      },
      resourceReady(newValue) {
        this.Player.emit('resourceReady', newValue);
      }
    },
  }

</script>

<style scoped>
  /*.xgplayer-definition p.name:before{*/
  /*content: '画质';*/
  /*display: block;*/
  /*}*/
  .musuc_mv {
    position: relative;
    color: #333;
    text-align: center;
    height: 580px;
    overflow: hidden;
    overflow-y: auto;
    width: 100%;
    padding: 20px;
    border: 1px solid #d2d8e6;
    box-shadow: 0 0 15px #333333;
  }

  .music-user {
    padding-bottom: 5px;
    margin-bottom: 15px;
    font-size: 18px;
    border-bottom: 1px solid #d2d8e6;

  }

  .brilliant h4 {
    display: block;
    margin-bottom: 10px;
    border-bottom: 1px solid #d2d8e6;
  }

  .brilliant > li {
    border-bottom: 1px solid #d2d8e6;
    margin-bottom: 10px;
    padding-bottom: 10px;
    width: 100%;
  }

  .hot-comments li:last-child {
    border-bottom: 0;
  }

  .brilliant .brilliant-img {
    width: 40px;
    margin-right: 10px;

  }

  .brilliant .brilliant-img img {
    width: 40px;
    height: 40px;
    border-radius: 50%;

  }

  .brilliant .brilliant-content {
    width: 90%;
  }

  .music_mv_play i.el-icon-arrow-left {
    font-size: 18px;
    cursor: pointer;
  }

  .music_mv_play span.span_mv {
    display: inline-block;
    width: 30px;
    height: 20px;
    border: 1px solid rgba(162, 0, 0, 0.69);
    text-align: center;
    color: rgba(162, 0, 0, 0.69);
    position: relative;
    top: -2px;
    font-family: Arial;
  }

  ul.song-cd-iocn {
    position: relative;
    top: 14px;
  }

  ul.song-cd-iocn li {
    display: block;
    height: 15px;
    background-color: rgba(238, 238, 238, 0.31);
    float: left;
    padding: 5px 10px;
    margin-right: 10px;
    text-align: center;
    line-height: 15px;
    border: 1px solid #d7d7d7;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
  }

  ul.song-cd-iocn li i {
    padding-right: 3px;
    font-size: 18px;
    position: relative;
    top: 2px;
  }
</style>
