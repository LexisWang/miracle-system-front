<template>
  <el-row :gutter="16">
    <div class="add-row">
      <el-button disabled>新增行数</el-button>
      <el-input-number
        v-model="addRowCount"
        :disabled="!editing"
        :precision="0"
        :controls="false"
        style="margin-right: 8px"
        @keydown.enter.down="(e) => addRows(e.target.value)"
      />
      <el-button type="info" @click="addRows" :disabled="!editing">新增</el-button>
      <el-button type="danger" @click="cleanRows" :disabled="!editing">清空</el-button>
    </div>
  </el-row>
  <el-table :data="tableData" show-summary :summary-method="getSummaries">
    <el-table-column label="序号" type="index" width="55" :fixed="'left'"/>
    <el-table-column
      v-for="item in tableColumns" :key="item.prop"
      :fixed="item.fixed"
      :property="item.prop"
      :label="item.label"
      :min-width="item.width"
      :formatter="(row, column, cellValue) => item.formatter?.(cellValue, item.type)"
      :type="item.type"
    >
      <template #default="{row}">
        <el-select
          v-if="item.type === 'select'"
          v-model="row[item.prop]"
          :multiple="item.multiple || false"
          :collapse-tags-tooltip="true"
          :collapse-tags="true"
          placeholder="请输入"
          :disabled="!editing"
        >
          <el-option
            :key="otp.value"
            :label="otp.label"
            :value="otp.value"
            v-for="otp in selectOpts[item.prop]"
          />
        </el-select>
        <el-autocomplete
          v-else-if="item.type === 'autocomplete'"
          v-model="row[item.prop]"
          :fetch-suggestions="(qs, cb) => getSuggestData(item.prop, qs, cb)"
          placeholder="请输入"
          :disabled="!editing"
          clearable
        />
        <el-cascader
          v-else-if="item.type === 'cascade'"
          v-model="row[item.prop]"
          :options="cascadeOpts[item.prop]"
          :props="{checkStrictly: true, multiple: item.multiple || false}"
          :disabled="!editing"
          collapse-tags
          filterable
          clearable
        />
        <el-date-picker
          v-else-if="item.type === 'date' || item.type === 'datetime'"
          :type="item.type"
          v-model="row[item.prop]"
          placeholder="请输入"
          :disabled="!editing"
          @change="(v) => tansDateToInt(v, row, item.prop)"
        />
        <input-number
          v-else-if="item.type === 'number'"
          :min="item.min"
          :max="item.max"
          :value="row[item.prop]"
          :options="item.options"
          :disabled="!editing"
          @change="(v) => row[item.prop] = v"
        />
        <el-input
          v-else
          v-model="row[item.prop]"
          placeholder="请输入"
          :disabled="!editing"
          :maxlength="item.maxlength"
        />
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="85" :fixed="'right'">
      <template #default="{$index}">
        <el-button type="danger" @click="deleteRow($index)" :disabled="!editing">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
//a.公共引入
import { ref, withDefaults, watchEffect } from 'vue';
//b.自定义类型引入
import type { ListColumnType, SummaryMethodProps } from "@/type/base-type";
//c.自定义工具引入
//d.其他组件引入
import InputNumber from '@/pages/components/InputNumber.vue';

//1.1父组件参数
const props = withDefaults(defineProps<{
  tableData: any[];
  tableColumns: ListColumnType[];
  selectOpts?: any;
  cascadeOpts?: any;
  suggestOpts?: any;
  editing?: boolean;
}>(), {
  selectOpts: () => ({}),
  cascadeOpts: () => ({}),
  suggestOpts: () => ({}),
});
const addRowCount = ref(0);

//2.各按钮处理函数
const emits = defineEmits<{
  (e: 'reset-sum-row', param: any[]): void
  (e: 'handle-calculate'): void
}>();
//2.1.表格数据求和
const getSummaries = (param: SummaryMethodProps<typeof props.tableData>) => {
  const { columns, data } = param;
  const sumRow: any[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sumRow[index] = '总计';
      return
    }
    const values = data.map((item: any) => Number(item[column.property]))
    if (column.type === 'number' && !values.every((value) => Number.isNaN(value))) {
      //计算求和值
      sumRow[index] = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0);
    } else {
      sumRow[index] = 'N/A'
    }
  })
  emits('reset-sum-row', sumRow);
  return sumRow;
};
//2.2.筛选建议输入
const getSuggestData = (key: string, qs: string, cb: (arg: any) => void) => {
  const suggestOpts = props.suggestOpts[key];
  const results = qs ?
    suggestOpts.filter((item: any) => item.value.toLowerCase().includes(qs.toLowerCase()))
    : suggestOpts;
  cb(results);
};
//2.3.日期转为时间戳
const tansDateToInt = (v: Date, row: any, prop: string) => {
  row[prop] = v.valueOf();
};
//2.4.添加表格行
const addRows = (value: any) => {
  const needAddRows = value instanceof Object ? addRowCount.value : value;
  props.tableData.push(...Array.from(new Array(+needAddRows || 1)).map(() => ({})));
};
//2.5.删除表格行
const deleteRow = (index: number) => {
  props.tableData.splice(index, 1);
};
const cleanRows = () => {
  props.tableData.splice(0, props.tableData.length);
};

watchEffect(() => emits('handle-calculate'));
</script>

<style lang="scss" scoped>
.add-row {
  margin-left: 8px;
}
</style>