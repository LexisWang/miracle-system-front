<template>
  <router-view/>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, watch } from "vue";
import { useWebSocket } from "@/hooks";
import { useGlobalStore } from "@/stores/global";

const globalStore = useGlobalStore();

onMounted(() => {
  if (globalStore.loginData.userid) {
    useWebSocket(globalStore.loginData.userid!, e => globalStore.notifyMsg = e.data);
  }
});

//后台主动发来的提示信息
watch(() => globalStore.notifyMsg, (newNotifyMsg) => {
  ElMessage.warning(newNotifyMsg);
});
</script>

<style lang="scss">

</style>
