<template>
  <div class="header-container">
    <div class="l-content">
      <el-button size="small" @click="onChangeMenuCollapse">
        <el-icon>
          <Menu/>
        </el-icon>
      </el-button>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item
          v-for="menu in globalStore.currentMenu.filter(item => item.name !== 'home')"
          :to="menu.path"
          :key="menu.path"
        >
          {{ menu.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <img class="user-icon" src="../../assets/userIcon.png" alt="加载图片失败">
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item @click="logoutHandler">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/global';
import { ArrowRight } from '@element-plus/icons-vue';

const router = useRouter();
const globalStore = useGlobalStore();
const onChangeMenuCollapse = () => {
  globalStore.isCollapse = !globalStore.isCollapse;
};
const logoutHandler = () => {
  router.replace({ path: '/login' });
};
</script>

<style lang="scss" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #333;
  height: 50px;

  .l-content {
    display: flex;

    .el-button {
      margin: 0 10px;
    }

    .crumbs {
      color: white;
      font-size: 14px;
    }

    .el-breadcrumb {
      ::v-deep(span) {
        color: white;
        line-height: 24px;
      }
    }
  }

  .r-content {
    .user-icon {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
}
</style>