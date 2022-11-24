<template>
  <div>订单款项</div>
  <el-input v-model="orderFund"/>
</template>

<script setup lang="ts">
import { ref } from "vue";

const orderFund = ref<string>();
</script>

<style scoped>

</style>