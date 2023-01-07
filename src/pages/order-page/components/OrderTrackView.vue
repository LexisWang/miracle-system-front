<template>
  <div>订单轨迹</div>
  <el-input v-model="orderTrack"/>
  <input-number :options="options" :min="-999999999999" />
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import InputNumber from '@/pages/components/InputNumber.vue';

const options = reactive<{
  symbol?: string;
  format?: string;
  thousand?: string;
  decimal?: string;
  precision?: string;
}>({
  symbol: '$',
  precision: '2'
});
const orderTrack = ref<string>();
</script>

<style scoped>

</style>