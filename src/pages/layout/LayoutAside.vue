<template>
  <el-scrollbar>
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      :default-active="globalStore.currentFullPath"
      text-color="#fff"
      :collapse="globalStore.isCollapse"
    >
      <h3>{{ globalStore.isCollapse ? '暖猫后台' : '暖猫后台管理' }}</h3>
      <menu-tree :data="asideMenus" :router="router" :is-collapse="globalStore.isCollapse"/>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { useRouter } from "vue-router";

import MenuTree from '@/pages/components/MenuTree.vue';

const router = useRouter();
const routes = router.getRoutes();
const globalStore = useGlobalStore();
const asideMenus = routes.filter(item => item.meta.isShow && item.meta.parent === 'home');

</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;
  border-right: 0;

  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400;
  }
}

.icon {
  width: 24px;
  height: 18px;
  padding-right: 5px;
}
</style>