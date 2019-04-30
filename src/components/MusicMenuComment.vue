<template>
  <div class="comment">
    <div class="comment-content">
      <el-input
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 5}"
        :rows="5"
        placeholder="请输入内容"
        v-model="comment"
        maxlength="140"
        show-word-limit
      >
      </el-input>
      <div class="comment-submit">
        <div class="comment-submit-icon fl">
          <i class="el-icon-eleme"></i>
          <i class="el-icon-eleme"></i>
          <i class="el-icon-eleme"></i>
        </div>
        <div class="comment-submit-button fr">
          <el-button plain>评论</el-button>
        </div>
      </div>
    </div>
    <div class="comment-user">
      <h3>最新评论({{ total }})</h3>
      <div class="users-new-comment">
        <ul class="user-new-comment">
          <li class="fl" v-for="comment,index in commentData" :key=" index">
            <div class="fl user-photo">
              <img :src="comment.user.avatarUrl +'?param=40y40'" alt="">
            </div>
            <div class="fl user-comment-content">
              <span class="user-nickname" >{{comment.user.nickname}}</span>
              <span class="user-colon">:</span>
                {{ comment.content}}
              <div class="user-time">
                <span>{{comment.time | convertDate}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MusicMenuComment",
    props:['commentData','total'],
    data() {
      return {
        comment: '',
      }
    }
  }
</script>

<style scoped lang="less">
  .comment {
    border-top: 1px solid #EBEEF5;
  }
  .comment-content {
    margin: 20px 30px;
    padding: 15px;
    height: 105px;
    background-color: rgba(235, 238, 245, 0.69);

  }
  .comment-submit {
    margin-top: 10px;

  }
  .comment-submit-icon {
    i {
      font-size: 20px;
    }
  }
  .comment-submit-button {
    button {
      padding: 5px 8px;
    }
  }

  .comment-user{
    margin: 50px 30px 20px;
    h3{
      font-size: 14px;
    }
    .users-new-comment{
      height: 400px;
      margin-top: 5px;
      border-top: 1px solid #EBEEF5;
    }
  }
  .user-new-comment{
    li{
      border-bottom: 1px solid #d2d8e6;
      margin-bottom: 10px;
      padding: 10px;
      width: 100%;
    }
    .user-photo{
      width: 40px;
      margin: 8px 10px 0 0;
      img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .user-comment-content{
      width: 90%;
      .user-nickname{
        color: #0086b3;
      }
      .user-colon{
        font-size: 18px;
        color: #0086b3;

      }
      .user-time{
        padding-top: 8px;
        span{
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
</style>
