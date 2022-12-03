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
      <el-table-column label="序号" type="index" width="54" :fixed="'left'"/>
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
      <el-table-column label="操作" align="center" width="60" :fixed="'right'" v-permission="operatePerm">
        <template #default="{row}">
          <el-dropdown trigger="click">
            <el-icon @click.stop>
              <Expand/>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in operateMenus" :key="item.key">
                  <div v-permission="item.permission">
                    <el-icon>
                      <component :is="item.icon"/>
                    </el-icon>
                    <span
                      v-if="!item.isConfirm"
                      @click="item.callback(row)"
                    >
                      {{ item.name }}
                    </span>
                    <miracle-popover
                      v-else :text="item.name || switchText(row)"
                      :title="confirmTitle(row, item.confirmType)"
                      :is-delete="item.confirmType === 'delete'"
                      @confirm-callback="(remark) => item.callback({ row, remark })"
                    />
                  </div>
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
import { ref, withDefaults } from 'vue';
import { Expand } from '@element-plus/icons-vue';
//b.自定义类型引入
import type { ListColumnType, OperateMenuType } from "@/type/base-type";
//c.自定义工具引入
import { setCellColor } from '@/utils/transform';
import MiraclePopover from '@/pages/components/MiraclePopover.vue';
import type { ElPermissionType } from "@/type/base-type";

//1.父组件参数
const props = withDefaults(defineProps<{
  tableClass?: string;
  tableLoading?: boolean;
  tableColumns: ListColumnType[];
  listData: any[];
  operateMenus?: OperateMenuType[];
  operatePerm?: ElPermissionType;
  selectOpts?: any;
  rowMainProp?: string;
  rowStatusProp?: string;
}>(), {
  tableLoading: () => false,
  rowMainProp: 'name',
  rowStatusProp: 'status',
})

//3.该组件上下文参数
const ctx = ref<object>({
  persons: [
    { name: '张三', age: 11 },
    { name: '李四', age: 22 },
    { name: '王五', age: 33 },
  ]
});

//设置confirmTitle
const confirmTitle: (row: any, confirmType: string) => string = (row, confirmType) => {
  if (confirmType === 'switch') {
    if (row[props.rowStatusProp] === 1) {
      return `确认禁用(${row[props.rowMainProp]})吗?`;
    } else {
      return `确认启用(${row[props.rowMainProp]})吗?`;
    }
  } else if (confirmType === 'reset') {
    return `确认重置(${row[props.rowMainProp]})数据吗?`;
  } else if (confirmType === 'delete') {
    return `确认删除(${row[props.rowMainProp]})数据吗?`;
  } else {
    return '';
  }
};

//设置`启/禁用`文字
const switchText = (row: any) => {
  if (row[props.rowStatusProp] === 1) {
    return '禁用';
  } else {
    return '启用'
  }
};

</script>

<style lang="scss" scoped>

</style>