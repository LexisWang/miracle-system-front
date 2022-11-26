<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :other-operates="otherOperates"
        :select-opts="{
          orgStatus: statusOpts,
        }"
        :cascade-opts="{
          pid: pidOpts,
        }"
        @search-callback="searchCallback"
        @reset-callback="resetCallback"
        @create-callback="handleAdd"
      />
    </div>
    <miracle-table
      class="page-main"
      ref="tableInstance"
      :table-loading="tableLoading"
      :table-columns="tableColumns"
      :list-data="records"
      :operate-menus="operateMenus"
      :select-opts="{
        orgStatus: statusOpts,
        isLeaf: isLeafOpts,
      }"
      row-main-prop="orgName"
      row-status-prop="orgStatus"
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
          :page-sizes="[5, 10, 15, 20, 50, 100]"
          v-model:current-page="searchData.current"
          :layout="'total, sizes, prev, pager, next, jumper'"
        />
      </template>
    </miracle-table>
    <miracle-modal
      :modal-add-edit="addEditModal"
      :add-edit-data="addEditData"
      :display-data="displayData"
      :form-rules="formRules"
      :cascade-opts="{
        pIdArr: pidOpts,
      }"
      :radio-opts="{
        orgStatus: statusOpts,
        isLeaf: isLeafOpts,
      }"
      :footer-button="footerButton"
      :editing="addEditEditing"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import { binaryChoiceOpts, normalStatusOpts } from "@/utils/constant";
import type { AddEditButtonType, ListColumnType, OperateMenuType, OptType, SearchColumnType } from "@/type/base-type";
import type { OrgListType, OrgOptsType, OrgPageDataType, OrgSearchType } from "@/type/system/org-type";
import MiracleTable from '@/pages/components/MiracleTable.vue';
import MiracleSearch from '@/pages/components/MiracleSearch.vue';
import MiracleModal from '@/pages/components/MiracleModal.vue';
import { CaretRight, DeleteFilled, Edit, Switch, View } from "@element-plus/icons-vue";
import { dateToString, valueToLabel } from "@/utils/transform";
import {
  orgAddData,
  orgDataExport,
  orgDeleteData,
  orgOptsData,
  orgPageData,
  orgUpdateData
} from "@/service/system/org-api";

//筛选栏数据相关
const statusOpts = ref<OptType[]>();
const pidOpts = ref<OrgOptsType[]>();
const isLeafOpts = ref<OptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'orgName', placeholder: '名称' },
  { type: 'input', prop: 'orgCode', placeholder: '代码' },
  { type: 'select', prop: 'orgStatus', placeholder: '状态' },
  { type: 'cascade', prop: 'pid', placeholder: '父组织' },
  {
    type: 'date-picker',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '新建时间(起始)',
    endTimeStr: '新建时间(结束)'
  },
  { type: 'input', prop: 'orgNames', placeholder: '名称(多个)', span: 12 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { name: 'org-add', code: 1 } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '导出',
    key: 'export',
    icon: CaretRight,
    callback: orgDataExport,
    permission: { name: 'export-org', code: 2 },
  },
];
const searchData = ref<OrgSearchType>({ current: 1, size: 15 });
const searchCallback = () => {
  tableLoading.value = true;
  orgPageData(searchData.value).then(({ data }) => {
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
  // addEditData.value = {
  //   orgStatus: 1,
  // };
  addEditData.value = {};
};

//表格模块数据相关
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'orgCode', label: '代码', fixed: 'left', width: 140 },
  { prop: 'orgName', label: '名称', fixed: 'left', width: 140 },
  { prop: 'orgStatus', label: '状态', enumTrans: valueToLabel },
  { prop: 'isLeaf', label: '是否叶子', enumTrans: valueToLabel },
  { prop: 'sortNo', label: '排序号' },
  { prop: 'scopeKey', label: '权限码' },
  { prop: 'tierLevel', label: '数据等级' },
  { prop: 'createTime', label: '新建时间', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '修改时间', type: 'date', formatter: dateToString, width: 100 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '详情',
    icon: View,
    key: 'detail',
    callback: (row: OrgListType) => {
      row.name = row.orgName;
      row.pIdArr = JSON.parse(row.pIds?.toString() || '[]')
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
  },
  {
    name: '修改',
    icon: Edit,
    key: 'edit',
    callback: (row: OrgListType) => {
      row.name = row.orgName;
      row.pIdArr = JSON.parse(row.pIds?.toString() || '[]')
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { name: 'org-update', code: 2 },
  },
  {
    icon: Switch,
    key: 'switchEffect',
    isConfirm: true,
    confirmType: 'switch',
    callback: (row: OrgListType) => {
      orgUpdateData({ id: row.id, orgStatus: row.orgStatus === 1 ? 0 : 1 });
      searchCallback();
    },
    permission: { name: 'org-switch-status', code: 3 },
  },
  {
    name: '删除',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row, remark }) => {
      orgDeleteData([row.id], remark);
      searchCallback();
    },
    permission: { name: 'org-delete', code: 4 },
  },
];
const tableData = reactive<OrgPageDataType>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//弹窗模块数据相关
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<OrgListType>();
const displayData: SearchColumnType[] = [
  { prop: 'pIdArr', label: '父组织:', type: 'cascade' },
  { prop: 'orgCode', label: '代码:', type: 'input', span: 11 },
  { prop: 'orgName', label: '名称:', type: 'input', span: 11 },
  { prop: 'orgDesc', label: '描述:', type: 'textArea' },
  { prop: 'address', label: '联系地址:', type: 'textArea' },
  { prop: 'contact', label: '联系方式:', type: 'input' },
  { prop: 'email', label: '联系邮箱:', type: 'input', span: 15 },
  {
    prop: 'sortNo',
    label: '排序号',
    type: 'number',
    options: { symbol: '', precision: '0' },
    onChange: (v) => addEditData.value!.sortNo = v,
    span: 7,
  },
  { prop: 'isLeaf', label: '是否叶子:', type: 'radio', span: 8 },
  { prop: 'orgStatus', label: '状态:', type: 'radio', span: 14 },
];
const formRules = {
  orgCode: [
    { required: true, message: '请输入代码', trigger: 'blur' },
    { min: 4, max: 16, message: '代码长度4~16之间', trigger: 'blur' },
  ],
  orgName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 4, max: 16, message: '名称长度4~16之间', trigger: 'blur' },
  ],
  sortNo: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
  ],
  isLeaf: [
    { required: true, message: '请选择是否叶子', trigger: 'blur' },
  ],
  orgStatus: [
    { required: true, message: '请选择状态', trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { name: 'org-cancel-submit', code: 5 },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { name: 'org-ensure-submit', code: 5 },
    onClick: async () => {
      const { value: data } = addEditData
      const extraData: {
        pId?: number;
        pIds?: string;
        tierLevel?: number;
      } = {};
      //进行输出的重组装处理
      if (!data?.pIdArr || data.pIdArr.length === 0) {
        extraData.pId = 0;
        extraData.pIds = '[0]';
        extraData.tierLevel = 0;
      } else {
        extraData.pId = data.pIdArr[data.pIdArr.length - 1];
        extraData.pIds = JSON.stringify(data.pIdArr);
        extraData.tierLevel = data.pIdArr.length;
      }
      const submitData: OrgListType = { ...data, ...extraData };
      if (data?.id) {
        await orgUpdateData(submitData);
      } else {
        await orgAddData(submitData);
      }
      addEditModal.value = false;
      addEditEditing.value = false;
      searchCallback();
    },
  },
];

//生命周函数
onMounted(() => {
  statusOpts.value = normalStatusOpts;
  isLeafOpts.value = binaryChoiceOpts;
  orgOptsData().then(({ data }) => {
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