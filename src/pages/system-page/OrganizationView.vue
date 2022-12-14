<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :other-operates="otherOperates"
        :other-operates-perm="{code: '1-1-1', name: 'org-search'}"
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
    <div class="page-main">
      <miracle-table
        ref="tableInstance"
        :table-loading="tableLoading"
        :table-columns="tableColumns"
        :list-data="records"
        :operate-menus="operateMenus"
        :operate-perm="{code: '1-1-2', name: 'org-table'}"
        :select-opts="{
          orgStatus: statusOpts,
          isLeaf: isLeafOpts,
        }"
        row-main-prop="orgName"
        row-status-prop="orgStatus"
        :upload-extra-data="uploadExtraData"
        :attachments="attachments"
        :upload-visible="uploadVisible"
        :upload-title="uploadTitle"
        :attachments-visible="attachmentsVisible"
        :attachments-list-title="attachmentsTitle"
        @close-upload="closeUpload"
        @close-attachments="closeAttachments"
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
      :cascade-opts="{
        pIds: pidOpts,
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
import type {
  AddEditButtonType,
  BaseOptType,
  ListColumnType,
  NormalPageDataType,
  OperateMenuType,
  SearchColumnType,
  TreeOptType
} from "@/type/base-type";
import type { OrgListType, OrgSearchType } from "@/type/system/org-type";
import MiracleTable from '@/pages/components/MiracleTable.vue';
import MiracleSearch from '@/pages/components/MiracleSearch.vue';
import MiracleModal from '@/pages/components/MiracleModal.vue';
import { CaretRight, DeleteFilled, Edit, Switch, View, Upload, List } from "@element-plus/icons-vue";
import { dateToString, valueToLabel } from "@/utils/transform";
import {
  orgAddData,
  orgDeleteData,
  orgExportData,
  orgOptsData,
  orgPageData,
  orgUpdateData
} from "@/service/system/org-api";
import { orgCodeCheck, orgNameCheck } from "@/validator/system/org-validator";
import type { UploadExtraDataType, UploadRespDataType } from "@/type/base-type";
import { attachmentList } from "@/service/common/attachment-api";

//?????????????????????
const statusOpts = ref<BaseOptType[]>();
const pidOpts = ref<TreeOptType[]>();
const isLeafOpts = ref<BaseOptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'orgName', placeholder: '??????' },
  { type: 'input', prop: 'orgCode', placeholder: '??????' },
  { type: 'select', prop: 'orgStatus', placeholder: '??????' },
  { type: 'cascade', prop: 'pid', placeholder: '?????????' },
  {
    type: 'date',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '????????????(??????)',
    endTimeStr: '????????????(??????)'
  },
  { type: 'input', prop: 'orgNames', placeholder: '??????(??????)', span: 12 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '1-1-1-1', name: 'org-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '??????(??????)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      orgExportData({ ...searchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '1-1-1-2', name: 'export-org-all' },
  },
  {
    name: '??????(??????)',
    key: 'exportPage',
    icon: CaretRight,
    callback: () => {
      orgExportData(searchData.value).then();
    },
    permission: { code: '1-1-1-3', name: 'export-org-page' },
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
  addEditData.value = {
    orgStatus: 1,
  };
};

//????????????????????????
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'orgCode', label: '??????', fixed: 'left', width: 140 },
  { prop: 'orgName', label: '??????', fixed: 'left', width: 140 },
  { prop: 'orgStatus', label: '??????', enumTrans: valueToLabel },
  { prop: 'isLeaf', label: '????????????', enumTrans: valueToLabel },
  { prop: 'sortNo', label: '?????????' },
  { prop: 'scopeKey', label: '?????????' },
  { prop: 'tierLevel', label: '????????????' },
  { prop: 'createTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '??????',
    icon: View,
    key: 'detail',
    callback: (row: OrgListType) => {
      row.name = row.orgName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
    permission: { code: '1-1-2-1', name: 'org-detail' },
  },
  {
    name: '??????',
    icon: Edit,
    key: 'edit',
    callback: (row: OrgListType) => {
      row.name = row.orgName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { code: '1-1-2-2', name: 'org-update' },
  },
  {
    icon: Switch,
    key: 'switchEffect',
    isConfirm: true,
    confirmType: 'switch',
    callback: ({ row }) => {
      orgUpdateData({ id: row.id, orgStatus: row.orgStatus === 1 ? 0 : 1 }).then(() => searchCallback());
    },
    permission: { code: '1-1-2-3', name: 'org-switch-status' },
  },
  {
    name: '??????',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row, remark }) => {
      orgDeleteData([row.id], remark).then(() => searchCallback());
    },
    permission: { code: '1-1-2-4', name: 'org-delete' },
  },
  {
    name: '??????',
    icon: Upload,
    key: 'uploadFile',
    callback: (row: OrgListType) => {
      attachmentList({ category: 'consignor', relatedId: row.id }).then(({ data }) => {
        attachments.value = data;
      });
      uploadTitle.value = `????????????(${row.orgName})??????`
      uploadExtraData.value = { category: 'consignor', relatedId: row.id };
      uploadVisible.value = true;
    },
    permission: { code: '1-1-2-5', name: 'org-upload' },
  },
  {
    name: '??????',
    icon: List,
    key: 'attachments',
    callback: (row: OrgListType) => {
      attachmentList({ category: 'consignor', relatedId: row.id }).then(({ data }) => {
        attachments.value = data;
      });
      attachmentsVisible.value = true;
      attachmentsTitle.value = row.orgName!;
    },
    permission: { code: '1-1-2-6', name: 'org-attachments' },
  },
];
const tableData = reactive<NormalPageDataType<OrgListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };
const attachments = ref<UploadRespDataType[]>([]);
const uploadExtraData = ref<UploadExtraDataType>();
const uploadVisible = ref(false);
const uploadTitle = ref('');
const attachmentsVisible = ref(false);
const attachmentsTitle = ref('');
const closeUpload = () => uploadVisible.value = false;
const closeAttachments = () => attachmentsVisible.value = false;

//????????????????????????
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<OrgListType>();
const displayData: SearchColumnType[] = [
  { prop: 'pIds', label: '?????????:', type: 'cascade' },
  { prop: 'orgCode', label: '??????:', type: 'input', span: 11 },
  { prop: 'orgName', label: '??????:', type: 'input', span: 11 },
  { prop: 'orgDesc', label: '??????:', type: 'textArea' },
  { prop: 'address', label: '????????????:', type: 'textArea' },
  { prop: 'contact', label: '????????????:', type: 'input' },
  { prop: 'email', label: '????????????:', type: 'input', span: 15 },
  {
    prop: 'sortNo',
    label: '?????????',
    type: 'number',
    options: { symbol: '', precision: '0' },
    onChange: (v) => addEditData.value!.sortNo = v,
    span: 7,
  },
  { prop: 'isLeaf', label: '????????????:', type: 'radio', span: 8 },
  { prop: 'orgStatus', label: '??????:', type: 'radio', span: 14 },
];
const formRules = {
  orgCode: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 16, message: '????????????4~16??????', trigger: 'blur' },
    { validator: (r: any, v: any, c: any, valida: any, o: any) => orgCodeCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur' },
  ],
  orgName: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 16, message: '????????????4~16??????', trigger: 'blur' },
    { validator: (r: any, v: any, c: any, valida: any, o: any) => orgNameCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur' },
  ],
  sortNo: [
    { required: true, message: '??????????????????', trigger: 'blur' },
  ],
  isLeaf: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
  orgStatus: [
    { required: true, message: '???????????????', trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { code: '1-1-3-1', name: 'org-cancel-submit' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { code: '1-1-3-2', name: 'org-ensure-submit' },
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

//???????????????
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