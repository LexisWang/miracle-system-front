<template>
  <el-container class="layout">
    <el-aside width="auto">
      <layout-aside/>
    </el-aside>
    <el-container>
      <el-header height="50px">
        <layout-header/>
      </el-header>
      <layout-tab class="layout-tab"/>
      <el-main>
        <router-view v-slot="{ Component }">
          <keep-alive v-if="needKeepAlive">
            <component :is="Component"/>
          </keep-alive>
          <component v-else :is="Component"/>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import LayoutAside from '@/pages/layout/LayoutAside.vue';
import LayoutHeader from '@/pages/layout/LayoutHeader.vue';
import LayoutTab from '@/pages/layout/LayoutTab.vue';
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "@/stores/global";
import type { TagDataType } from "@/type/base-type";

const router = useRouter();
const globalStore = useGlobalStore();
const needKeepAlive = ref<boolean>();
const layoutTabList: TagDataType[] = globalStore.layoutTabList;
watch(() => router.currentRoute.value.path, (newPath) => {
  needKeepAlive.value = layoutTabList.findIndex(item => item.path === newPath) !== -1;
});

</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;

  .el-aside {
    background: #545c64;
  }
}

.el-header {
  padding: 0;
}

.layout-tab {
  padding-top: 5px;
  padding-left: 5px;
}

.el-main {
  height: calc(100vh - 80px);
  //padding: 5px;
}
</style>