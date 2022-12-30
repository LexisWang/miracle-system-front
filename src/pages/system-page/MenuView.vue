<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :other-operates="otherOperates"
        :other-operates-perm="{code: '1-3-1', name: 'menu-search'}"
        :select-opts="{
          menuStatus: statusOpts,
        }"
        :cascade-opts="{
          pid: pidOpts,
        }"
        @search-callback="searchCallback"
        @reset-callback="resetCallback"
        @create-callback="handleAdd"
      />
    </div>
    <div class="page-main">
      <miracle-table
        ref="tableInstance"
        :table-loading="tableLoading"
        :table-columns="tableColumns"
        :list-data="records"
        :operate-menus="operateMenus"
        :operate-perm="{code: '1-3-2', name: 'menu-table'}"
        :select-opts="{
        menuStatus: statusOpts,
        isLeaf: isLeafOpts,
      }"
        row-main-prop="menuName"
        row-status-prop="menuStatus"
      >
        <template #footer>
          <el-pagination
            small
            background
            :total="total"
            class="page-main-footer"
            @size-change="searchCallback"
            @current-change="searchCallback"
            v-model:page-size="searchData.size"
            :page-sizes="[15, 30, 50, 100]"
            v-model:current-page="searchData.current"
            :layout="'total, sizes, prev, pager, next, jumper'"
          />
        </template>
      </miracle-table>
    </div>
    <miracle-modal
      :modal-add-edit="addEditModal"
      :add-edit-data="addEditData"
      :display-data="displayData"
      :form-rules="formRules"
      :select-opts="{
        reqMethod: reqMethodOpts,
      }"
      :cascade-opts="{
        pIds: pidOpts,
      }"
      :radio-opts="{
        menuStatus: statusOpts,
        isLeaf: isLeafOpts,
      }"
      :footer-button="footerButton"
      :editing="addEditEditing"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import { binaryChoiceOpts, normalStatusOpts, requestMethodOpts } from "@/utils/constant";
import type {
  AddEditButtonType,
  BaseOptType,
  ListColumnType,
  NormalPageDataType,
  OperateMenuType,
  SearchColumnType,
  TreeOptType
} from "@/type/base-type";
import MiracleTable from '@/pages/components/MiracleTable.vue';
import MiracleSearch from '@/pages/components/MiracleSearch.vue';
import MiracleModal from '@/pages/components/MiracleModal.vue';
import { CaretRight, DeleteFilled, Edit, Switch, View } from "@element-plus/icons-vue";
import { dateToString, valueToLabel } from "@/utils/transform";
import { menuCodeCheck, menuNameCheck } from "@/validator/system/menu-validator";
import type { MenuListType, MenuSearchType } from "@/type/system/menu-type";
import {
  menuAddData,
  menuDeleteData,
  menuExportData,
  menuOptsData,
  menuPageData,
  menuUpdateData
} from "@/service/system/menu-api";

//筛选栏数据相关
const reqMethodOpts = ref<BaseOptType[]>();
const statusOpts = ref<BaseOptType[]>();
const pidOpts = ref<TreeOptType[]>();
const isLeafOpts = ref<BaseOptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'menuName', placeholder: '名称' },
  { type: 'input', prop: 'menuCode', placeholder: '代码' },
  { type: 'select', prop: 'menuStatus', placeholder: '状态' },
  { type: 'cascade', prop: 'pid', placeholder: '父菜单' },
  {
    type: 'date-picker',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '新建时间(起始)',
    endTimeStr: '新建时间(结束)'
  },
  { type: 'input', prop: 'menuNames', placeholder: '名称(多个)', span: 12 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '1-3-1-1', name: 'menu-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '导出(全部)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      menuExportData({ ...searchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '1-3-1-2', name: 'export-menu-all' },
  },
  {
    name: '导出(本页)',
    key: 'exportPage',
    icon: CaretRight,
    callback: () => {
      menuExportData(searchData.value).then();
    },
    permission: { code: '1-3-1-3', name: 'export-menu-page' },
  },
];
const searchData = ref<MenuSearchType>({ current: 1, size: 15 });
const searchCallback = () => {
  tableLoading.value = true;
  menuPageData(searchData.value).then(({ data }) => {
    records.value = data.records;
    total.value = data.total;
    tableLoading.value = false;
  }).catch(() => tableLoading.value = false);
};
const resetCallback = () => {
  searchData.value = { current: 1, size: 15 };
  searchCallback();
};
const handleAdd = () => {
  addEditModal.value = true;
  addEditEditing.value = true;
  addEditData.value = {
    menuStatus: 1,
  };
};

//表格模块数据相关
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'menuCode', label: '代码', fixed: 'left', width: 140 },
  { prop: 'menuName', label: '名称', fixed: 'left', width: 140 },
  { prop: 'menuStatus', label: '状态', enumTrans: valueToLabel },
  { prop: 'isLeaf', label: '是否叶子', enumTrans: valueToLabel },
  { prop: 'sortNo', label: '排序号' },
  { prop: 'tierLevel', label: '数据等级' },
  { prop: 'globalSort', label: '唯一序号' },
  { prop: 'createTime', label: '新建时间', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '修改时间', type: 'date', formatter: dateToString, width: 100 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '详情',
    icon: View,
    key: 'detail',
    callback: (row: MenuListType) => {
      row.name = row.menuName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
    permission: { code: '1-3-2-1', name: 'menu-detail' },
  },
  {
    name: '修改',
    icon: Edit,
    key: 'edit',
    callback: (row: MenuListType) => {
      row.name = row.menuName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { code: '1-3-2-2', name: 'menu-update' },
  },
  {
    icon: Switch,
    key: 'switchEffect',
    isConfirm: true,
    confirmType: 'switch',
    callback: ({ row }) => {
      menuUpdateData({ id: row.id, menuStatus: row.menuStatus === 1 ? 0 : 1 }).then(() => searchCallback());
    },
    permission: { code: '1-3-2-3', name: 'menu-switch-status' },
  },
  {
    name: '删除',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row, remark }) => {
      menuDeleteData([row.id], remark).then(() => searchCallback());
    },
    permission: { code: '1-3-2-4', name: 'menu-delete' },
  },
];
const tableData = reactive<NormalPageDataType<MenuListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//弹窗模块数据相关
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<MenuListType>();
const displayData: SearchColumnType[] = [
  { prop: 'pIds', label: '父菜单:', type: 'cascade' },
  { prop: 'menuCode', label: '代码:', type: 'input', span: 11 },
  { prop: 'menuName', label: '名称:', type: 'input', span: 11 },
  { prop: 'menuUrl', label: '路径URL:', type: 'textArea' },
  { prop: 'menuIcon', label: '图标:', type: 'input', span: 11 },
  {
    prop: 'sortNo',
    label: '排序号',
    type: 'number',
    options: { symbol: '', precision: '0' },
    onChange: (v) => addEditData.value!.sortNo = v,
    span: 11,
  },
  { prop: 'isLeaf', label: '是否叶子:', type: 'radio', span: 8 },
  { prop: 'menuStatus', label: '状态:', type: 'radio', span: 14 },
];
const formRules = {
  menuCode: [
    { required: true, message: '请输入代码', trigger: 'blur' },
    { min: 4, max: 16, message: '代码长度4~16之间', trigger: 'blur' },
    { validator: (r: any, v: any, c: any, valida: any, o: any) => menuCodeCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur' },
  ],
  menuName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 4, max: 16, message: '名称长度4~16之间', trigger: 'blur' },
    { validator: (r: any, v: any, c: any, valida: any, o: any) => menuNameCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur' },
  ],
  menuUrl: [
    { required: true, message: '请输入路径', trigger: 'blur' },
    { max: 64, message: '路径长度不能超过64', trigger: 'blur' },
  ],
  reqMethod: [
    { required: true, message: '请输入请求方式', trigger: 'blur' },
  ],
  sortNo: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
  ],
  isLeaf: [
    { required: true, message: '请选择是否叶子', trigger: 'blur' },
  ],
  menuStatus: [
    { required: true, message: '请选择状态', trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { code: '1-3-3-1', name: 'menu-cancel-submit' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { code: '1-3-3-2', name: 'menu-ensure-submit' },
    onClick: async () => {
      const { value: data } = addEditData
      const extraData: {
        pId?: number;
        tierLevel?: number;
      } = {};
      //进行输出的重组装处理
      if (!data?.pIds || data.pIds.length === 0) {
        extraData.pId = 0;
        extraData.tierLevel = 0;
      } else {
        extraData.pId = data.pIds[data.pIds.length - 1];
        extraData.tierLevel = data.pIds.length;
      }
      const submitData: MenuListType = { ...data, ...extraData };
      if (data?.id) {
        await menuUpdateData(submitData);
      } else {
        await menuAddData(submitData);
      }
      menuOptsData().then(({ data }) => {
        pidOpts.value = data;
      });
      addEditModal.value = false;
      addEditEditing.value = false;
      searchCallback();
    },
  },
];

//生命周函数
onMounted(() => {
  reqMethodOpts.value = requestMethodOpts;
  statusOpts.value = normalStatusOpts;
  isLeafOpts.value = binaryChoiceOpts;
  menuOptsData().then(({ data }) => {
    pidOpts.value = data;
  });
  searchCallback();
});

</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;

  &-header {
    flex-shrink: 0;
    margin-bottom: 10px;
  }

  &-main {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &-footer {
      margin-top: 10px;
      margin-left: auto;
    }
  }
}
</style>