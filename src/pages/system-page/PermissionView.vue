<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :other-operates="otherOperates"
        :other-operates-perm="{code: '1-2-1', name: 'perm-search'}"
        :select-opts="{
          permStatus: statusOpts,
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
        :operate-perm="{code: '1-2-2', name: 'perm-table'}"
        :select-opts="{
        permStatus: statusOpts,
        isLeaf: isLeafOpts,
      }"
        row-main-prop="permName"
        row-status-prop="permStatus"
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
        permStatus: statusOpts,
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
import { permCodeCheck, permNameCheck } from "@/validator/system/perm-validator";
import type { PermListType, PermSearchType } from "@/type/system/perm-type";
import {
  permAddData,
  permDeleteData,
  permExportData,
  permOptsData,
  permPageData,
  permUpdateData
} from "@/service/system/perm-api";

//?????????????????????
const reqMethodOpts = ref<BaseOptType[]>();
const statusOpts = ref<BaseOptType[]>();
const pidOpts = ref<TreeOptType[]>();
const isLeafOpts = ref<BaseOptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'permName', placeholder: '??????' },
  { type: 'input', prop: 'permCode', placeholder: '??????' },
  { type: 'select', prop: 'permStatus', placeholder: '??????' },
  { type: 'cascade', prop: 'pid', placeholder: '?????????' },
  {
    type: 'date',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '????????????(??????)',
    endTimeStr: '????????????(??????)'
  },
  { type: 'input', prop: 'permNames', placeholder: '??????(??????)', span: 12 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '1-2-1-1', name: 'perm-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '??????(??????)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      permExportData({ ...searchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '1-2-1-2', name: 'export-perm-all'},
  },
  {
    name: '??????(??????)',
    key: 'exportPage',
    icon: CaretRight,
    callback: () => {
      permExportData(searchData.value).then();
    },
    permission: { code: '1-2-1-3', name: 'export-perm-page' },
  },
];
const searchData = ref<PermSearchType>({ current: 1, size: 15 });
const searchCallback = () => {
  tableLoading.value = true;
  permPageData(searchData.value).then(({ data }) => {
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
    permStatus: 1,
  };
};

//????????????????????????
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'permCode', label: '??????', fixed: 'left', width: 140 },
  { prop: 'permName', label: '??????', fixed: 'left', width: 140 },
  { prop: 'permStatus', label: '??????', enumTrans: valueToLabel },
  { prop: 'isLeaf', label: '????????????', enumTrans: valueToLabel },
  { prop: 'sortNo', label: '?????????' },
  { prop: 'tierLevel', label: '????????????' },
  { prop: 'globalSort', label: '????????????' },
  { prop: 'createTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '??????',
    icon: View,
    key: 'detail',
    callback: (row: PermListType) => {
      row.name = row.permName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
    permission: { code: '1-2-2-1', name: 'perm-detail' },
  },
  {
    name: '??????',
    icon: Edit,
    key: 'edit',
    callback: (row: PermListType) => {
      row.name = row.permName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { code: '1-2-2-2', name: 'perm-update' },
  },
  {
    icon: Switch,
    key: 'switchEffect',
    isConfirm: true,
    confirmType: 'switch',
    callback: ({ row }) => {
      permUpdateData({ id: row.id, permStatus: row.permStatus === 1 ? 0 : 1 }).then(() => searchCallback());
    },
    permission: { code: '1-2-2-3', name: 'perm-switch-status' },
  },
  {
    name: '??????',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row, remark }) => {
      permDeleteData([row.id], remark).then(() => searchCallback());
    },
    permission: { code: '1-2-2-4', name: 'perm-delete' },
  },
];
const tableData = reactive<NormalPageDataType<PermListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//????????????????????????
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<PermListType>();
const displayData: SearchColumnType[] = [
  { prop: 'pIds', label: '?????????:', type: 'cascade' },
  { prop: 'permCode', label: '??????:', type: 'input', span: 11 },
  { prop: 'permName', label: '??????:', type: 'input', span: 11 },
  { prop: 'permUri', label: '??????URL:', type: 'textArea' },
  { prop: 'reqMethod', label: '????????????:', type: 'select', span: 11 },
  {
    prop: 'sortNo',
    label: '?????????',
    type: 'number',
    options: { symbol: '', precision: '0' },
    onChange: (v) => addEditData.value!.sortNo = v,
    span: 11,
  },
  { prop: 'isLeaf', label: '????????????:', type: 'radio', span: 8 },
  { prop: 'permStatus', label: '??????:', type: 'radio', span: 14 },
];
const formRules = {
  permCode: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 16, message: '????????????4~16??????', trigger: 'blur' },
    { validator: (r: any, v: any, c: any, valida: any, o: any) => permCodeCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur' },
  ],
  permName: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 16, message: '????????????4~16??????', trigger: 'blur' },
    { validator: (r: any, v: any, c: any, valida: any, o: any) => permNameCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur' },
  ],
  permUri: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { max: 64, message: '????????????????????????64', trigger: 'blur' },
  ],
  reqMethod: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
  sortNo: [
    { required: true, message: '??????????????????', trigger: 'blur' },
  ],
  isLeaf: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
  permStatus: [
    { required: true, message: '???????????????', trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { code: '1-2-3-1', name: 'perm-cancel-submit' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { code: '1-2-3-2', name: 'perm-ensure-submit' },
    onClick: async () => {
      const { value: data } = addEditData
      const extraData: {
        pId?: number;
        tierLevel?: number;
      } = {};
      //??????????????????????????????
      if (!data?.pIds || data.pIds.length === 0) {
        extraData.pId = 0;
        extraData.tierLevel = 0;
      } else {
        extraData.pId = data.pIds[data.pIds.length - 1];
        extraData.tierLevel = data.pIds.length;
      }
      const submitData: PermListType = { ...data, ...extraData };
      if (data?.id) {
        await permUpdateData(submitData);
      } else {
        await permAddData(submitData);
      }
      permOptsData().then(({ data }) => {
        pidOpts.value = data;
      });
      addEditModal.value = false;
      addEditEditing.value = false;
      searchCallback();
    },
  },
];

//???????????????
onMounted(() => {
  reqMethodOpts.value = requestMethodOpts;
  statusOpts.value = normalStatusOpts;
  isLeafOpts.value = binaryChoiceOpts;
  permOptsData().then(({ data }) => {
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