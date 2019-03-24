<template>

</template>

<script>
  export default {
    name: "blankVue"
    ,
    created() {

      switch(this.$route.query.type )
      {
        case 'mv':
          this.$router.replace({
            path: 'mv',
            query:{
              id:this.$route.query.id,
            },
            name: 'mv'
          });
          break;
        case 'music':
          this.$router.replace({
            path: 'music',
            name: 'music'
          });
          break;
        default:
      }

    }
  }
</script>

<style scoped>

</style>
