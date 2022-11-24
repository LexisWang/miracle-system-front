<template>
  <div>
    <el-tag
      :key="tab.path"
      :closable="true"
      @click="changeMenu(tab)"
      :disable-transitions="false"
      v-for="(tab, index) in layoutTabList"
      @close="handleCloseTag(tab, index)"
      :effect="$route.name === tab.name ? 'dark' : 'plain'"
    >
      {{ tab.title }}
    </el-tag>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";
import { useRoute, useRouter } from "vue-router";
import type { TagDataType } from "@/type/base-type";

const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();
const layoutTabList = globalStore.layoutTabList;

//激活tab标签
const changeMenu = (tab: TagDataType) => {
  router.push({
    name: tab.name
  });
};
//关闭tab标签
const handleCloseTag = (tab: TagDataType, index: number) => {
  layoutTabList.splice(index, 1);
  if (tab.name !== route.name) {
    return;
  }
  const length = layoutTabList.length;
  if (length === index && index > 0) {
    router.push({ name: layoutTabList[length - 1].name }).then();
  }
};

</script>

<style lang="scss" scoped>
.el-tag {
  margin-right: 8px;
  cursor: pointer;
}
</style>
