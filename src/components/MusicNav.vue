<template>
  <div>
    <ul class="music-nav-top">
      <li>
        <router-link to="/"><img src="@/assets/imges/music.png" alt=""></router-link>
      </li>
      <li>
        <div class="grid-content bg-purple">
          <i class="el-icon-arrow-left" @click="$router.go(-1)"></i>
          <i class="el-icon-arrow-right" @click="$router.go(1)"></i>
        </div>
      </li>
      <li>
        <div class="grid-content bg-purple-light musicInput">
          <el-autocomplete
            v-model="searchMusic"
            :fetch-suggestions="querySearchAsync"
            :trigger-on-focus="false"
            placeholder="搜索音乐,歌手,电台,视频"
            @select="handleSelect">
            <i
              class="el-icon-search"
              slot="suffix"
              @click="handleIconClick">
            </i>
            <template slot-scope="{ item }">
              <div v-if=" item[0] == 'songs' " style="pointer-events: none;">搜“<span style="color:#00b4e6;">{{ searchMusic }}</span>”相关结果>
              </div>
              <div class="item-name" v-if=" item[0] == 'artists' "><i class="iconfont lyd-geshou"></i> 歌手</div>
              <div class="item-name" v-if=" item[0] == 'songs' "><i class="iconfont lyd-yinle4"></i> 单曲</div>
              <div class="item-name" v-if=" item[0] == 'playlists' "><i class="iconfont lyd-gedan"></i> 歌单</div>
              <div class="item-name" v-if=" item[0] == 'mvs' "><i class="iconfont lyd-shipin2"></i> 视频</div>
              <div class="item-name" v-if=" item[0] == 'albums' "><i class="iconfont lyd-zhuanji1"></i> 专辑</div>
              <span v-for=" val,index in item[1]" :key="index" class="item-content" v-if="val.name.length < 12 "
                    @click="getIndex(index)">
                {{val.name}} <span v-for="item,index in val.artists" v-if=" val.artists != 'undefined'">- {{ item.name  | hanziLimit(10)}}</span>
              </span>
              <span v-for=" val,index in item[1]" :key="index" class="item-content" v-if="val.name.length >= 12 "
                    @click="getIndex(index)">
                {{val.name | hanziLimit(12)}}
              </span>
            </template>
          </el-autocomplete>
        </div>
      </li>
      <div class="fr">
        <li>
          <i class="circle" @click="login">
            <img :src="userInfo.avatarUrl+'?param=25y25'" alt="" v-if="userInfo != null">
          </i>
          <el-popover
            v-if="userInfo == null"
            placement="bottom"
            width="350"
            :visible-arrow="false"

            trigger="click">
            <div class="login">
              <div class="login-ewm">
                <div class="login-sao-ewm">
                  <img src="@/assets/imges/ewm_1.jpg" alt="">
                  <span>扫码登录更安全</span>
                </div>
                <div class="login-shouji">
                  <i class="iconfont lyd-shouji"></i>
                </div>


              </div>
              <div class="login-message">
                <el-input placeholder="请输入手机号" v-model="loginId" class="input-with-select">
                  <el-select v-model="selectWord" slot="prepend" placeholder="+86">
                    <el-option label="中国" value="86"></el-option>
                    <el-option label="中国香港" value="852"></el-option>
                    <el-option label="美国" value="1"></el-option>
                  </el-select>
                </el-input>
                <el-input
                  placeholder="请输入密码"
                  type="password"
                  prefix-icon="iconfont lyd-icon-"
                  v-model="password">
                  <template slot="append">重设密码</template>
                </el-input>
                <el-checkbox v-model="autoLogon">自动登录</el-checkbox>
                <div>
                  <el-button type="danger" @click="login">登录</el-button>
                </div>
                <div style="margin: 5px auto;width: 50px;">
                  <a href="/">注册</a>
                </div>
                <div class="else-login">
                  <h3>其他登录方式</h3>
                  <div>
                    <ul class="else-logins-icon">
                      <li><i class="iconfont lyd-changyonglogo28"></i></li>
                      <li><i class="iconfont lyd-shouji"></i></li>
                      <li><i class="iconfont lyd-weibo1"></i></li>
                      <li><i class="iconfont lyd-shouji"></i></li>
                    </ul>
                    <ul class="else-logins-text">
                      <li>微信</li>
                      <li>微信</li>
                      <li>微信</li>
                      <li>微信</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <span slot="reference">未登录 <i class="el-icon-caret-bottom"></i></span>
          </el-popover>
          <el-popover
            v-if="userInfo != null"
            placement="bottom"
            width="250"
            trigger="click">
            <div class="user-info">
              <div>
                <i class="circle" @click="login">
                  <img :src="userInfo.avatarUrl+'?param=40y40'">
                </i>
                <span class="user-info-name">{{ userInfo.nickname }}</span>
                <span class="user-info-sign"><i class="el-icon-date"></i>签到</span>
              </div>
              <div class="user-info-fans">
                <div class="fl">
                  <span style="font-size: 18px;font-family: sans-serif">0</span><br>
                  <span>动态</span>
                </div>
                <div class="fl"
                     style="width: 1px;height: 35px;background-color:rgba(38, 45, 51, 0.11);"></div>
                <div class="fl">
                  <span style="font-size: 18px;font-family: sans-serif">0</span><br>
                  <span>关注 </span>
                </div>
                <div class="fl"
                     style="width: 1px;height: 35px;background-color:rgba(38, 45, 51, 0.11);"></div>
                <div class="fl">
                  <span style="font-size: 18px;font-family: sans-serif">0</span><br>
                  <span>粉丝 </span>
                </div>
              </div>
              <div class="clearfix"></div>

              <div class="user-info-for">
                <div>
                  <span><i class="iconfont lyd-huiyuan" style="padding-right: 3px"></i> 会员中心</span>
                  <div class="fr">未订购 ></div>
                </div>
                <div>
                  <span><i class="iconfont lyd-dengji" style="padding-right: 3px"></i> 等级</span>
                  <div class="fr">Lv.5 ></div>
                </div>
                <div>
                  <span><i class="iconfont lyd-gouwuche" style="padding-right: 3px"></i> 商城</span>
                  <div class="fr"> ></div>
                </div>
              </div>

              <div class="user-info-for">
                <div>
                  <span><i class="el-icon-setting" style="padding-right: 3px"></i> 个人信息设置</span>
                  <div class="fr"> ></div>
                </div>
                <div>
                  <span><i class="iconfont lyd-shouji" style="padding-right: 3px"></i> 绑定社交账号</span>
                  <div class="fr">
                    <i class="iconfont lyd-weibo1" style="padding-right: 3px"></i>
                    <i class="iconfont lyd-changyonglogo28" style="padding-right: 3px"></i>
                    >
                  </div>
                </div>
              </div>

              <div class="user-info-for">
                <div>
                  <span @click="logout"><i class="iconfont lyd-tuichu5" style="padding-right: 3px"></i> 退出登录</span>
                </div>
              </div>
            </div>
            <span slot="reference">{{ userInfo.nickname }} <i class="el-icon-caret-bottom"></i></span>
          </el-popover>

        </li>
        <li>
          <el-popover
            popper-class="pf-style"
            placement="bottom"
            trigger="click"
            reference
          >
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane name="first">
                <span slot="label">主题</span>
                <ul class="pfzt-items">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </el-tab-pane>
              <el-tab-pane name="second">
                <span slot="label">纯色</span>
                <ul class="pfcs-items">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </el-tab-pane>
            </el-tabs>
            <el-button icon="iconfont lyd-pifugexinghuazhuti-xianxing" slot="reference">
            </el-button>
          </el-popover>
        </li>
        <li>
          <el-badge :value="2" class="item">
            <i class="el-icon-message"></i>
          </el-badge>
        </li>
        <li><i class="el-icon-setting"></i></li>
        <li>|</li>
        <li><i class="iconfont lyd-minimize"></i></li>
        <li><i class="iconfont lyd-minimize_window"></i></li>
        <li><i class="iconfont lyd-zuidahua"></i></li>
        <li><i class="iconfont lyd-x"></i></li>
      </div>
    </ul>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "MusicNav",
    data() {
      return {
        loginId: '',
        password: '',
        country: '',
        restaurants: [],
        searchMusic: '',
        musicId: '',
        activeName: 'first',
        typeNum: 1,
        isRedirect: true,
        userInfo: null,
        autoLogon: true,
        selectWord: '',
      };
    },
    created: function () {
    },
    computed: {
      ...mapState([
        'loginStatus',
      ]),
    },
    methods: {
      ...mapMutations({
        changeIsRouterAlive: 'changeIsRouterAlive',
        changeLoginStatus: 'changeLoginStatus'
      }),
      clickSearchMusic() {
        //利用if判断，进行页面的重新刷新
        this.isRedirect = false;
        this.changeIsRouterAlive(false);
        this.$nextTick(function () {
          this.isRedirect = false;
          this.changeIsRouterAlive(true);
        })
      },
      //搜索框下拉搜索
      querySearchAsync(queryString, cb) {
        this.searchMusic = queryString;
        const getSearchKeywords = async () => {
          try {
            let searchKeywordsurl = '/search/suggest?keywords=' + queryString;
            let searchKeywordsData = await this.$http.get(searchKeywordsurl);
            this.restaurants = searchKeywordsData.result;
            let searchResult = Object.entries(this.restaurants);
            let searchResultLen = searchResult.length;
            let orderlen = searchResult[searchResultLen - 1][1];
            let orderSearchResult = [];
            searchResult.map(item => {
              for (let i = 0; i < orderlen.length; i++) {
                if (item[0] == orderlen[i]) {
                  orderSearchResult[i] = item;
                }
              }
            })
            cb(orderSearchResult); //回调函数 指向 => handleSelect();
            console.log( orderSearchResult )
          } catch (e) {
            console.log(e)
          }
        }
        getSearchKeywords();
      },
      getIndex(i) {
        this.typeNum = i;
      },
      handleSelect(item) {
        let type = item[0];
        let items = item[1];
        let itemNum = this.typeNum;
        switch (type) {
          case "songs":
            this.$router.push({
                name: 'search',
                query: {
                  id: items[itemNum].id,
                  name: items[itemNum].name
                }
              }
            );
            break;
          case "artists":
            console.log(2)
            break;
          case "albums":
            this.$router.push({
                name: 'album',
                query: {
                  id: items[itemNum].id,
                }
              }
            );
            break;
          case "mvs":
            this.$router.push({
                name: 'mv',
                query: {
                  id: items[itemNum].id,
                  type: 'mv'
                }
              }
            );
            break;
          case "playlists":
            this.$router.push({
                name: 'menu',
                query: {
                  id: items[itemNum].id
                }
              }
            );
            break;
          default:
            console.log(6)
            break;
        }
        this.clickSearchMusic();
      },

      //皮肤选择点击
      handleClick(tab, event) {
        console.log(tab, event);
      },
      //搜索框图标点击选择
      handleIconClick() {
        this.$router.push({
            name: 'search',
            query: {
              name: this.searchMusic
            }
          }
        );
        this.clickSearchMusic();
      },
      login() {
        const getLogin = async () => {
          try {
            let loginUrl = "/login/cellphone?phone=" + this.country + this.loginId + "&password=" + this.password;
            let loginData = await this.$http.get(loginUrl);
            localStorage.setItem("userInfo", JSON.stringify(loginData.profile));
            sessionStorage.setItem("userStatus", 200);
            this.userInfo = loginData.profile;
            this.changeLoginStatus();
          } catch (e) {
            console.log(e)
          }
        }
        getLogin();
      }
      ,
      logout() {
        const getLogout = async () => {
          try {
            let logoutUrl = "/logout";
            let logoutData = await this.$http.get(logoutUrl);
            if (logoutData.code == 200) {
              this.userInfo = null;
              localStorage.removeItem("userInfo");
              sessionStorage.setItem("userStatus", 301);
              this.changeLoginStatus();
            }
            else {
              alert('退出失败，请重试')
            }
          } catch (e) {
            console.log(e)
          }
        }
        getLogout();
      }
    },
    watch: {
      loginStatus(status) {
        if (status == 200) {
          this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
        }
      },
    }
  }
</script>

<style>
  .el-select .el-input {
    width: 80px;
  }

  .user-info .circle {
    width: 40px;
    height: 40px;
  }

  .user-info-name {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    margin: 0 20px 0 8px;
  }

  .user-info-sign {
    padding: 2px;
    display: inline-block;
    width: 50px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border: 1px solid rgba(194, 194, 194, 0.38);
    border-radius: 3px;
  }

  .user-info-fans div {
    width: 32%;
    text-align: center;
    margin: 10px 0;
  }

  .user-info-for {
    border-top: 1px solid rgba(194, 194, 194, 0.38);
  }

  .user-info-for > div {
    height: 20px;
    padding: 10px 5px;
    cursor: pointer;
    line-height: 20px;
  }

  .user-info-for > div:hover {
    background-color: #f5f7fa;
  }

  .item-name {
    background-color: #f5f7fa;
    padding-left: 5px;
    pointer-events: none;
  }

  span.item-content {
    display: flex;
    padding-left: 25px;
    font-size: 12px;
    color: #555;
    cursor: pointer;
  }

  .el-autocomplete-suggestion li.highlighted, .el-autocomplete-suggestion li:hover {
    background-color: transparent;
  }

  .el-autocomplete-suggestion li.highlighted, .el-autocomplete-suggestion li span:hover {
    background-color: #f5f7fa;
  }

  ul.music-nav-top > li, ul.music-nav-top > div.fr > li {
    float: left;
    margin: 6px 5px 0;
  }

  ul.music-nav-top > li:nth-child(1) {
    position: relative;
    top: -8px;
  }

  ul.music-nav-top > li:nth-child(2) i {
    display: block;
    width: 25px;
    height: 20px;
    float: left;
    padding-top: 2px;
    color: rgba(245, 245, 220, 0.47);
    border: 1px solid #00000038;
    font-size: 16px;
    text-align: center;
    border-radius: 3px;
  }

  ul.music-nav-top > li:nth-child(3) input {
    height: 24px;
    background-color: #A82828;
    color: #C77373;
    border-radius: 12px;
    line-height: 22px;
    border: 0;
  }

  ul.music-nav-top > li:nth-child(3) i.el-icon-search {
    position: relative;
    top: 1px;
    left: -3px;
  }

  ul.music-nav-top > div.fr > li:nth-child(1) i {
    margin: 0 5px;

  }

  i.circle {
    display: block;
    float: left;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: beige;
    overflow: hidden;
  }

  ul.music-nav-top > div.fr > li:nth-child(1) span, i.el-icon-caret-bottom {
    position: relative;
    top: 1px;
    font-size: 12px;
    color: aliceblue;
    cursor: pointer;
  }

  i.el-icon-caret-bottom {
    font-size: 16px;
  }

  ul.music-nav-top > div.fr > li i {
    color: #f0f8ff94;
    cursor: pointer;
  }

  ul.music-nav-top > div.fr > li:nth-child(2) .iconfont, i.el-icon-setting, i.el-icon-message {
    position: relative;
    top: 4px;
    font-size: 20px;

  }

  .el-badge__content {
    width: 6px;
    height: 14px;
    line-height: 14px;
    border-radius: 50%;
    padding: 0 4px;
    background-color: #fff;
    color: #C62F2F;
    top: 6px !important;
  }

  ul.music-nav-top > div.fr > li:nth-child(2) button {
    background: #C62F2F;
    border: 0;
    padding: 0;
  }

  ul.pfzt-items {
    width: 318px;
  }

  ul.pfzt-items li {
    width: 100px;
    height: 95px;
    margin: 3px;
    float: left;

    background-color: aquamarine;
    cursor: pointer;
  }

  ul.music-nav-top > div.fr > li:nth-child(5) {
    font-size: 24px;
    font-family: monospace;
    margin: 0;
  }

  ul.music-nav-top > div.fr > li:nth-child(6) .iconfont, ul.music-nav-top > div.fr > li:nth-child(8) .iconfont, ul.music-nav-top > div.fr > li:nth-child(9) .iconfont {
    position: relative;
    top: 4px;
  }

  ul.music-nav-top > div.fr > li:nth-child(7) .iconfont {
    position: relative;
    top: -2px;
  }

  .login {
    height: 530px;
    margin: 3px;
  }

  .el-autocomplete-suggestion li {
    cursor: auto;
    padding: 0 10px;
  }

  .login-sao-ewm {
    height: 50px;
  }

  .login-sao-ewm img {
    width: 60px;
    height: 60px;
    cursor: pointer;
  }

  .login-sao-ewm span {
    position: relative;
    top: -25px;
    left: -5px;
    background: rgba(158, 158, 158, 0.63);
    color: #FFF;
    padding: 5px;
  }

  .login-shouji {
    width: 90px;
    margin: 0 auto;
  }

  .login-shouji i {
    font-size: 90px;
    color: red;
  }

  .login-message {
    margin: 10px 40px;
  }

  .login-message .el-checkbox {
    margin-top: 5px;
  }

  .login-message .el-button {
    width: 100%;
    margin-top: 10px;
  }

  .else-login {
    margin-top: 80px;
  }

  .else-login h3 {

    background-color: #fff;
    display: block;
    width: 100px;
    height: 10px;
    margin: 0 auto;
    text-align: center;
  }

  .else-login::before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: #222222;
    position: relative;
    top: 10px;
    z-index: -1;
  }

  .else-login ul.else-logins-icon li {
    float: left;
    width: 35px;
    height: 35px;
    padding: 3px;
    margin: 15px 10px 5px;
    border: 1px solid rgba(162, 162, 162, 0.49);
    border-radius: 50%;

  }

  .else-login ul.else-logins-text li {
    float: left;
    width: 35px;
    padding: 3px;
    margin: 0 11px;
    text-align: center;
  }

  .else-login ul.else-logins-icon li i {
    font-size: 26px;
    margin: 0 4px;
    color: red;

  }
</style>
