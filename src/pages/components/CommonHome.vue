<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="staff-info">
          <img src="../../assets/userIcon.png" alt="加载图片失败">
          <div>
            <p class="staff-name">奇迹哥</p>
            <p class="staff-name">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间: <span>2022-11-01</span></p>
          <p>上次登录地点: <span>广东广州</span></p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.home {
  .staff-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: solid 1px #ccc;

    img {
      width: 80px;
      height: 80px;
      padding-right: 20px;
      margin-bottom: 20px;
    }
  }

  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;

      span {
        color: #666;
      }
    }

    span {
      margin-left: 5px;
    }
  }
}
</style>