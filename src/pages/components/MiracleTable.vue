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
          v-else-if="item.maxWidth"
          :prop="item.prop"
          :label="item.label"
        >
          <template #default="{ row, column }">
            <el-tooltip
              effect="dark"
              :content="row[column.property]"
              placement="top"
            >
              <div :style="`max-width: ${item.maxWidth}px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis`">
                {{ row[column.property] }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
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
                      @confirm-callback="(remark) => confirmCallback(item, row, remark)"
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
  <MiracleUpload
    :modal-title="`上传-${uploadTitle}`"
    :visible="uploadVisible"
    :extra-data="uploadExtraData"
    :file-list="attachments"
    :close-callback="() => emits('close-upload')"
  />
  <el-dialog
    :width="610"
    :title="`(${attachmentsListTitle})附件列表`"
    v-model="attachmentListVisible"
    :before-close="() => emits('close-attachments')"
    :close-on-click-modal="false"
  >
    <el-table :data="attachments">
      <el-table-column property="name" label="缩略图" width="80">
        <template #default="{row}">
          <a :href="row.filePath" target="_blank">
            <img v-if="['png', 'jpg', 'jpeg', 'gif', 'dpg', 'webp'].includes(row.fileFormat)"
              style="width: 32px; height: 32px" :src="row.filePath" alt="无法加载图片" />
            <span v-else>{{ row.fileName }}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column width="160" property="fileName" label="文件名" />
      <el-table-column width="150"  property="creator" label="上传者" />
      <el-table-column
        width="180"
        property="upTime"
        label="上传时间"
        :formatter="(row, column, cellValue) => dateToString(cellValue, 'datetime')"
      />
    </el-table>
  </el-dialog>
  <slot name="footer"/>
  <!--  <template v-for="person in persons">
      <slot :data="person"/>
    </template>-->
</template>

<script lang="ts" setup="">
//a.公共引入
import { computed, ref, withDefaults } from 'vue';
import { Expand } from '@element-plus/icons-vue';
//b.自定义类型引入
import type {
  ElPermissionType,
  ListColumnType,
  OperateMenuType,
  UploadExtraDataType,
  UploadRespDataType
} from "@/type/base-type";
//c.自定义工具引入
import { dateToString, setCellColor } from '@/utils/transform';
import MiraclePopover from '@/pages/components/MiraclePopover.vue';
import MiracleUpload from '@/pages/components/MiracleUpload.vue';
import { ElMessage } from "element-plus";

//1.父组件参数
const props = withDefaults(defineProps<{
  tableWidth?: number;
  tableClass?: string;
  tableLoading?: boolean;
  tableColumns: ListColumnType[];
  listData: any[];
  operateMenus?: OperateMenuType[];
  operatePerm?: ElPermissionType;
  selectOpts?: any;
  rowMainProp?: string;
  rowStatusProp?: string;

  uploadExtraData?: UploadExtraDataType;
  attachments?: UploadRespDataType[];
  uploadVisible?: boolean;
  uploadTitle?: string;
  attachmentsVisible?: boolean;
  attachmentsListTitle?: string;
}>(), {
  tableLoading: () => false,
  rowMainProp: 'name',
  rowStatusProp: 'status',
})

const emits = defineEmits<{
  (e: 'close-upload'): void
  (e: 'close-attachments'): void
}>();

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
  } else if (confirmType === 'resetPwd') {
    return `确认重置(${row[props.rowMainProp]})密码吗?`;
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

//4.提交处理
const confirmCallback = async (item: any, row: any, remark: any) => {
  await item.callback({ row, remark });
  ElMessage.success("操作成功");
};

const attachmentListVisible = computed(() => props.attachmentsVisible);

</script>

<style lang="scss" scoped>

</style>