<template>
  <div>订单轨迹</div>
  <el-input v-model="orderTrack"/>
</template>

<script setup lang="ts">
import { ref } from "vue";

const orderTrack = ref<string>();
</script>

<style scoped>

</style>