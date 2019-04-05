<template>
  <div id="app">
      <transition name="el-fade-in">

        <keep-alive v-if="$route.meta.keepAlive">
            <router-view/>

        </keep-alive>

        <router-view v-if="!$route.meta.keepAlive"/>
      </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
