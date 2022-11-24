<template>
  <el-card body-style="padding:5px; height:100%">
    <el-table
      v-loading="tableLoading"
      ref="singleTableRef"
      highlight-current-row
      style="width: 100%"
      :data="listData"
      height="100%"
    >
      <el-table-column label="序号" type="index" width="52" :fixed="'left'"/>
      <template v-for="item in tableColumns" :key="item.prop">
        <el-table-column
          v-if="item.enumTrans"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
        >
          <template #default="scope">
            <el-tag :color="setCellColor(scope, selectOpts[item.prop])" effect="dark">
              {{ item.enumTrans(scope, selectOpts[item.prop]) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.formatter"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :formatter="(row, column, cellValue) => item.formatter(cellValue, item.type)"
        />
        <el-table-column
          v-else
          :fixed="item.fixed"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
        />
      </template>
      <el-table-column label="操作" align="center" width="60" :fixed="'right'">
        <template #default="{row}">
          <el-dropdown trigger="click">
            <el-icon @click.stop>
              <Expand/>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in operateMenus" :key="item.key">
                  <el-icon>
                    <component :is="item.icon"/>
                  </el-icon>
                  <span @click="item.callback(row)">{{ item.name }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <slot name="footer"/>
  <!--  <template v-for="person in persons">
      <slot :data="person"/>
    </template>-->
</template>

<script lang="ts" setup="">
//a.公共引入
import { defineProps, ref, withDefaults } from 'vue';
import { Expand } from '@element-plus/icons-vue';
//b.自定义类型引入
import type { ListColumnType, OperateMenuType } from "@/type/base-type";
//c.自定义工具引入
import { setCellColor } from '@/utils/transform';

//1.父组件参数
withDefaults(defineProps<{
  tableClass?: string;
  tableLoading?: boolean;
  tableColumns: ListColumnType[];
  listData: any[];
  operateMenus?: OperateMenuType[];
  selectOpts?: any;
}>(), {
  tableLoading: () => false
})

//3.该组件上下文参数
const ctx = ref<object>({
  persons: [
    { name: '张三', age: 11 },
    { name: '李四', age: 22 },
    { name: '王五', age: 33 },
  ]
});

</script>

<style lang="scss" scoped>

</style>