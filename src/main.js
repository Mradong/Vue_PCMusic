// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//引入第三方包 开始
import Vue from 'vue'
import router from './router'
import store from './store'
import '@/assets/icon/iconfont.css'

Vue.config.productionTip = false


//引入ElementUI
import ElementUI from 'element-ui';
import {Loading, Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

//引入高德地图插件
import VueAMap from 'vue-amap';  //注意不要和 AMap原始名称覆盖
Vue.use(VueAMap);
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '17841ab04122024dfe0ebc390b1506e2',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation'],
});

//引入moment时间插件
import Moment from 'moment'

Vue.prototype.$moment = Moment;//赋值使用

//引入Velocity.js动画组件
import Velocity from 'velocity-animate'

Vue.prototype.$Velocity = Velocity;

//Axios:引入axios
import Axios from 'axios';
//Axios:挂载原型
Vue.prototype.$axios = Axios;
// Axios:默认配置
Axios.defaults.baseURL = 'http://music.rexinshimin.cn:3000';
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.withCredentials = true;//跨域请求是否携带cooike

//全局路由,
router.beforeEach((to, from, next) => {
  switch (to.name) {
    case 'play':
      store.commit('changeIsPlayHtml', true);
      break;
    case 'mv':
      store.commit('changeIsPlayHtml', true);
      store.commit('changeMvPlay', true);
      store.commit('changeIsplay', false);
      break;
    default:
      store.commit('changeIsPlayHtml', false);
      store.commit('changeMvPlay', false);
  }
  next();
  // if(to.name =='mv' ){
  //   store.commit('changeIsPlayHtml', true)
  //   store.commit('changeMvPlay', true)
  // }
  // else {
  //   store.commit('changeIsPlayHtml', false)
  //   store.commit('changeMvPlay', false)
  // }

});


// // Axios:拦截器操作loadding
// // 超时时间
// Axios.defaults.timeout = 5000
// // http请求拦截器
// let loadinginstace
// Axios.interceptors.request.use(config => {
//   loadinginstace = Loading.service({fullscreen: true})
//   return config
// }, error => {
//   loadinginstace.close()
//   Message.error({
//     message: '加载超时'
//   })
//   return Promise.reject(error)
// })

// // http响应拦截器
// Axios.interceptors.response.use(data => {// 响应成功关闭loading
//   loadinginstace.close()
//   return data
// }, error => {
//   loadinginstace.close()
//   Message.error({
//     message: '加载失败'
//   })
//   return Promise.reject(error)
// })


//全局样式
import '@/assets/css/global.css';

//引入全局组件需要的组件对象 开始
import VueXgplayer from '@/components/MusicXgplayer.vue'

Vue.config.productionTip = false
Vue.component('VueXgplayer', VueXgplayer)

//引入全局组件需要的组件对象 结束


// 定义成全局组件或过滤器
Vue.filter('convertDate', function (value) {
  return Moment(value).format('YYYY年MM月DD日 HH：mm');
});
Vue.filter('mvDate', function (value) {
  return Moment(value).format('mm：ss');
});
Vue.filter('musicmenuDate', function (value) {
  return Moment(value).format('YYYY-MM-DD');
});

Vue.filter('musicDate', function (value) {
  let minute = (Math.floor(value / 60) >= 10 ? Math.floor(value / 60) : '0' + Math.floor(value / 60)) + ':' + (value % 60 >= 10 ? value % 60 : '0' + value % 60);
  return minute;
});
Vue.filter('completion', function (value, num, string) {
  return (value + 1).toString().padStart(num, string)
});

Vue.filter('toNum', function (value) {
  return parseInt(value);
});

Vue.filter('hanziLimit', function (value, num, type) {
  if (!value) return ''
  value = value.toString();
  if (value.length > num) {
    if (type != undefined) {
      return value.slice(0, num)
    }
    return value.slice(0, num) + '...'
  }
  return value
});


//引入自己的vue文件 开始 
import App from './App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
