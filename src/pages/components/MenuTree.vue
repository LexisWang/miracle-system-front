<template>
  <div v-for="menu in data" :key="menu.path">
    <el-menu-item
      v-if="!menu.children || menu.children.length === 0"
      :index="menu.path"
      @click="handleClickMenu(menu)"
    >
      <component class="icon" :is="menu.meta?.icon"></component>
      <span v-if="!isCollapse">{{ menu.meta?.title }}</span>
    </el-menu-item>
    <div v-else>
      <el-sub-menu
        :index="menu.path"
      >
        <template #title>
          <component class="icon" :is="menu.meta?.icon"></component>
          <span v-if="!isCollapse">{{ menu.meta?.title }}</span>
        </template>
        <menu-tree :data="menu?.children" :isCollapse="false" :router="router"/>
      </el-sub-menu>
    </div>
  </div>
</template>

<script setup lang='ts'>
import type { Router, RouteRecordRaw } from 'vue-router';

const props = defineProps<{ data?: RouteRecordRaw[]; isCollapse: boolean; router: Router }>();

const handleClickMenu: (menu: RouteRecordRaw) => void = menu => {
  props.router.push({
    name: menu.name
  });
};

</script>

<style lang="scss" scoped>
.icon {
  width: 24px;
  height: 18px;
  padding-right: 5px;
}
</style>