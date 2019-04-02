// index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    isRouterAlive: true,//是否显示右侧导航栏
    isPlayHtml:false,//是否显示音乐页面
    isMvPlay:false,//是否显示MV页面
    isPlay: false,//播放状态
    musicPlay:{},//存储当前播放歌曲信息
    musicList: [],//存储当前播放列表
  },
  // getters：派生状态。也就是set、get中的get，有两个可选参数：state、getters分别可以获取state中的变量和其他的getters。
  // 外部调用方式：store.getters.consoleCount()。就和vue的computed差不多；
  getters: {
    // 接受state作为参数，每次 count发生变化时 ， 都会被调用
    //就是用来监听数据变化的方法。
    watchMusicPlay: state => {
      return state.musicPlay;
    },
    doneTodos: (state, n) => {//通过方法访问
      return state.count += n;
    },
    getnewcurrentSrc: state => {
      return state.isPlay;
    },
  },
  // 提交状态修改。也就是set、get中的set，这是vuex中唯一修改state的方式，但不支持异步操作。
  // 第一个参数默认是state。外部调用方式：store.commit('addNumCount', 18)。和vue中的methods类似。
  mutations: {
    // 改变state状态的方法，不建议直接通过
    // this.$store.state.? = ？的方式改变state中的状态
    changemusicPlay:(state,n) =>{
      state.musicPlay = localStorage.getItem("musicplay");
    },
    changeIsplay:(state,n) =>{
      state.isPlay = n;
    },
    changeIsRouterAlive:(state,n) =>{
      state.isRouterAlive = n;
    },
    changeIsPlayHtml:(state,n) =>{
      state.isPlayHtml = n;
    },
    changeMusicTime:(state,n) =>{
      state.musicTime = n;
    },
    changeMvPlay:(state,n) =>{
      state.isMvPlay = n;
    },
  },
  // 和mutations类似。不过actions支持异步操作。第一个参数默认是和store具有相同参数属性的对象。外部调用方式：store.dispatch('addCount')。
  // 可以用来执行异步操作，可以跟踪异步数据状态变化
  actions: {
    addCount: context => {
      // 调用 mutation
      context.commit('addCount');
    },
    addNumCount: (context, n) => {
      context.commit('addNumCount', n);
    }
  },
  //引入某个store对象import dialog_store from '../components/dialog_store.js';
  //做出这样的修改之后 , 我们将之前我们使用的 $store.state.show 统统改为 $store.state.dialog.show 即可。
  //store的子模块，内容就相当于是store的一个实例。调用方式和前面介绍的相似，只是要加上当前子模块名，如：store.a.getters.xxx()。
  // modules: {
  //     dialog: dialog_store
  // }

})
//这样我们就可以在任何一个 component中通过 this.$store.dispatch('addNumCount', 5); 或者 this.$store.dispatch('addCount'); 去触发actions操作来改变state中的值。

