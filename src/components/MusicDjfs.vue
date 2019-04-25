<template>
  <div class="personalizedPrivate" style="margin: 0 20px;">
    <div class="song_menu">
      <el-row type="flex" class="row-bg">
        <el-col :span="22">
          <div class="grid-content bg-purple fz20">最新MV（因为没有独家放送的API，用最新MV的api替代）</div>
        </el-col>
      </el-row>
    </div>
    <div class="song_content">
      <ul >
        <li v-for="(item,index) in initNewMvs" :key="index" >
          <router-link :to="{name:'mv', query: { id: item.id ,type: 'mv'} }"><img :src="item.cover +'?param=375y135'" alt="">
          </router-link>
          <router-link to="/music/mv"><h2> {{item.name | hanziLimit(30) }}</h2></router-link>
          <p> {{item.artistName}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
    export default {
        name: "MusicDjfs",
      data(){
          return{
            initNewMvs:[],
          }
      },
      computed: {
        ...mapState([
          'newMvs',
        ]),
      },
      methods:{

      },
      created(){
        const getNewMv = async () => {
          try {
            let newMvUrl = '/mv/first?limit=20';
            let newMvData = await this.$http.get(newMvUrl);
            this.initNewMvs = newMvData.data;
          } catch (e) {
            console.log(e)
          }
        }
        getNewMv();
      },
      watch:{
        newMvs( val ){
          this.initNewMvs = val[0]  ;
        }
      }
    }
</script>



<style scoped>
  .song_menu {
    border-bottom: 1px solid rgba(6, 12, 6, 0.22);
    margin-top: 10px;
  }

  .song_content > ul > li {
    margin: 15px 5px;
    width: 375px;
    height: 175px;
    font-size: 12px;
    display: inline-block;
  }
</style>
