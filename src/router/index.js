import Vue from 'vue'
import Router from 'vue-router'

import blankVue from '@/components/blankVue'
import Music from '@/components/Music'
import MusicRec from '@/components/MusicRec'
import MusicSearch from '@/components/MusicSearch'
import MusicPlay from '@/components/MusicPlay'
import MusicVideo from '@/components/MusicVideo'
import MusicMenu from '@/components/MusicMenu'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'music',
      redirect: '/recommend',
      component: Music,
      meta: {
        keepAlive: true,
        isBack: false
      },
      children: [
        {
          path: 'recommend',
          name: 'recommend',
          component: MusicRec,
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: 'search',
          name: 'search',
          component: MusicSearch,
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: 'play',
          name: 'play',
          component: MusicPlay,
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: 'mv',
          name: 'mv',
          component: MusicVideo,
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: 'menu',
          name: 'menu',
          component: MusicMenu,
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: 'blank',
          name: 'blank',
          component: blankVue,
          meta: {
            keepAlive: true,
            isBack: false
          }
        }
      ]
      //要使用子路由，必有在父级页面，有相对应的<router-view/>，子路由才能生效
      // children:[
      //   {path:'article',name:'article',component:Article}
      // ]
    }
  ]

})
