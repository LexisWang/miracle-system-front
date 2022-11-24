<template>
  <dynamic-table
    ref="dynTableRef"
    :table-data="tableData"
    :table-columns="tableColumns"
    @reset-sum-row="resetSumRowData"
  />
  <el-row :gutter="16">
    <el-button type="primary" @click="onEnter">确认</el-button>
  </el-row>
</template>

<script setup lang="ts">
//a.公共引入
import { onMounted, ref } from "vue";
//b.自定义类型引入
import type { ListColumnType } from "@/type/base-type";
//c.自定义工具引入
//d.其他组件引入
import DynamicTable from '@/pages/components/DynamicTable.vue';

//1.2.本组件数据绑定
//1.2.1.dom元素绑定
//1.2.2.表格数据绑定
const tableData = ref<{
  goodsCode?: string;
  goodsName?: string;
  goodsAmount?: string;
  goodsKits?: number;
  goodsWeight?: number;
  goodsLength?: number;
  goodsWidth?: number;
  goodsHeight?: number;
  goodsVolume?: number;
}[]>([]);
const sumRowData = ref<any[]>();

//3.各组件部分属性配置
//3.1.表格配置
const tableColumns: ListColumnType[] = [
  { prop: 'goodsCode', label: '品名(英)', type: "input", maxlength: 16 },
  { prop: 'goodsName', label: '品名(中)', type: "input", maxlength: 16 },
  { prop: 'goodsAmount', label: '数量', type: 'input', maxlength: 16 },
  { prop: 'goodsKits', label: '件数', type: "number", options: { symbol: '', precision: '0' } },
  { prop: 'goodsWeight', label: '重量/KG', type: "number", options: { symbol: '', precision: '2' } },
  { prop: 'goodsLength', label: '长/CM', type: "number", options: { symbol: '', precision: '0' } },
  { prop: 'goodsWidth', label: '宽/CM', type: "number", options: { symbol: '', precision: '0' } },
  { prop: 'goodsHeight', label: '高/CM', type: "number", options: { symbol: '', precision: '0' } },
  { prop: 'goodsVolume', label: '体积/CM³', type: "number", options: { symbol: '', precision: '0' } },
];

//4.各按钮处理函数
const resetSumRowData = (data: any[]) => {
  sumRowData.value = data;
};
const onEnter = () => {
  console.log('tableData', tableData.value)
};

//5.生命周期函数
//5.1挂载完毕获取数据
onMounted(() => {
  console.log('货物组件挂载成功!');
});

</script>

<style lang="scss" scoped>

</style>