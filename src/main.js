// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//引入第三方包 开始
import router from './router'
import store from './store'
import '@/assets/icon/iconfont.css'
import http from './http';



//npm 引入方式
// import Vue from 'vue'
//引入ElementUI
// import ElementUI from 'element-ui';
// import {Loading, Message} from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
//引入moment时间插件
// import Moment from 'moment'
//引入Velocity.js动画组件
// import Velocity from 'velocity-animate'
//引入axios
// import Axios from 'axios';


//取消vue警告提示
Vue.config.productionTip = false

//Axios:挂载原型
Vue.prototype.$moment = moment;
Vue.prototype.$Velocity = Velocity;
Vue.prototype.$axios = axios;
Vue.prototype.$http = http;


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
});


//全局样式
import '@/assets/css/global.css';

//引入全局组件需要的组件对象
import VueXgplayer from '@/components/MusicXgplayer.vue'
Vue.component('VueXgplayer', VueXgplayer)


// 定义成全局组件或过滤器
Vue.filter('convertDate', function (value) {
  return moment(value).format('YYYY年MM月DD日 HH：mm');
});
Vue.filter('mvDate', function (value) {
  return moment(value).format('mm：ss');
});
Vue.filter('musicmenuDate', function (value) {
  return moment(value).format('YYYY-MM-DD');
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
