// import Vue from 'vue'
// import Router from 'vue-router'
// Vue.use(Router)


function loadView(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/components/${view}.vue`)
}

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'music',
      redirect: '/recommend',
      component: loadView('Music'),
      meta: {
        keepAlive: true,
        isBack: false
      },
      children: [
        {
          path: 'recommend',
          name: 'recommend',
          component: loadView('MusicRec'),
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: 'search',
          name: 'search',
          component: loadView('MusicSearch'),
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: 'play',
          name: 'play',
          component: loadView('MusicPlay'),
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: 'fm',
          name: 'fm',
          component: loadView('MUsicPersonalFM'),
          meta: {
            keepAlive: false,
            isBack: false
          }
        },

        {
          path: 'mv',
          name: 'mv',
          component: loadView('MusicVideo'),
          meta: {
            keepAlive: false,
            isBack: false
          }
        },
        {
          path: 'djfs',
          name: 'djfs',
          component: loadView('MusicDjfs'),
          meta: {
            keepAlive: false,
            isBack: false
          }
        },
        {
          path: 'menu',
          name: 'menu',
          component: loadView('MusicMenu'),
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: 'album',
          name: 'album',
          component: loadView('MusicAlbums'),
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: 'blank',
          name: 'blank',
          component: loadView('blankVue'),
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
