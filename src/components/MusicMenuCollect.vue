<template>
  <div class="collect" >
    <div class="subscribers" v-if="type == 'menu' ">
      <div class="subscriber " v-for=" subscriber,index in subscribersData" :key=" index">
        <div class="collect-avatar">
          <img :src="subscriber.avatarUrl+'?param=62y62'" alt="">
        </div>
        <div class="collect-nickname">
          <span>{{ subscriber.nickname}}</span>
        </div>
      </div>
    </div>
    <div v-if="type == 'album' " class=" album-introduce">
      <h1>专辑介绍</h1>
      <p v-html="subscribersData "></p>
    </div>
  </div>
</template>

<script>
    export default {
      name: "MusicMenuCollect",
      props:['subscribersData','type'],
    }
</script>

<style scoped lang="less">
  .collect{
    border-top: 1px solid #EBEEF5;
    .subscribers{
      margin: 20px 30px ;
      display: flex;
      flex-wrap: wrap;
    }
  }
  .subscriber{
    width: 18%;
    margin:  1%;
    .collect-avatar{
      border-radius: 50%;
      margin: 0 auto;
      width: 62px;
      height: 62px;
      overflow: hidden;
    }
    .collect-nickname{
      text-align: center;
    }
  }
.album-introduce{
  margin: 20px 40px;
}
</style>
