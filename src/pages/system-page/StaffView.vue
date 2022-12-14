<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :other-operates="otherOperates"
        :other-operates-perm="{code: '1-6-1', name: 'role-search'}"
        :select-opts="{
          staffStatus: statusOpts,
        }"
        :cascade-opts="{
          orgId: orgIdOpts,
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
        :operate-perm="{code: '1-6-2', name: 'role-table'}"
        :select-opts="{
          staffStatus: statusOpts,
          isLeaf: isLeafOpts,
        }"
        row-main-prop="username"
        row-status-prop="staffStatus"
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
        roleId: roleIdOpts,
        superId: superIdOpts,
      }"
      :cascade-opts="{
        orgIds: orgIdOpts,
      }"
      :radio-opts="{
        staffStatus: statusOpts,
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
import MiracleTable from '@/pages/components/MiracleTable.vue';
import MiracleSearch from '@/pages/components/MiracleSearch.vue';
import MiracleModal from '@/pages/components/MiracleModal.vue';
import { CaretRight, DeleteFilled, Edit, RefreshLeft, Switch, View } from "@element-plus/icons-vue";
import { dateToString, valueToLabel } from "@/utils/transform";
import { nicknameCheck, usernameCheck } from "@/validator/system/staff-validator";
import type { StaffListType, StaffSearchType } from "@/type/system/staff-type";
import {
  staffAddData,
  staffDeleteData,
  staffExportData,
  staffPageData,
  staffResetPwd,
  staffResetRedisLoginTime,
  staffSuperData,
  staffUpdateData,
} from "@/service/system/staff-api";
import { orgOptsData } from "@/service/system/org-api";
import { roleOptsData } from "@/service/system/role-api";

//?????????????????????
const statusOpts = ref<BaseOptType[]>();
const isLeafOpts = ref<BaseOptType[]>();
const orgIdOpts = ref<TreeOptType[]>([]);
const roleIdOpts = ref<BaseOptType[]>([]);
const superIdOpts = ref<BaseOptType[]>([]);
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'username', placeholder: '??????' },
  { type: 'input', prop: 'nickname', placeholder: '??????' },
  { type: 'select', prop: 'staffStatus', placeholder: '??????' },
  { type: 'cascade', prop: 'orgId', placeholder: '????????????' },
  {
    type: 'date',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '????????????(??????)',
    endTimeStr: '????????????(??????)'
  },
  { type: 'input', prop: 'nicknames', placeholder: '??????(??????)', span: 12 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '1-6-1-1', name: 'staff-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '??????(??????)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      staffExportData({ ...searchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '1-6-1-2', name: 'export-staff-all' },
  },
  {
    name: '??????(??????)',
    key: 'exportPage',
    icon: CaretRight,
    callback: () => {
      staffExportData(searchData.value).then();
    },
    permission: { code: '1-6-1-3', name: 'export-staff-page' },
  },
];
const searchData = ref<StaffSearchType>({ current: 1, size: 15 });
const searchCallback = () => {
  tableLoading.value = true;
  staffPageData(searchData.value).then(({ data }) => {
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
  addEditData.value = { staffStatus: 1, sortNo: -1 };
};

//????????????????????????
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'username', label: '??????' },
  { prop: 'nickname', label: '??????', width: 100 },
  { prop: 'mobile', label: '?????????', width: 110 },
  { prop: 'orgName', label: '????????????', width: 100 },
  { prop: 'roleName', label: '????????????', width: 110 },
  { prop: 'superName', label: '????????????' },
  { prop: 'staffStatus', label: '??????', enumTrans: valueToLabel },
  { prop: 'scopeKey', label: '?????????' },
  { prop: 'createTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '??????',
    icon: View,
    key: 'detail',
    callback: (row: StaffListType) => {
      row.name = row.roleName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
    permission: { code: '1-6-2-1', name: 'staff-detail' },
  },
  {
    name: '??????',
    icon: Edit,
    key: 'edit',
    callback: (row: StaffListType) => {
      roleOptsData(row.orgId!).then(({ data }) => {
        roleIdOpts.value = data;
      });
      row.name = row.roleName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { code: '1-6-2-2', name: 'staff-update' },
  },
  {
    icon: Switch,
    key: 'switchEffect',
    isConfirm: true,
    confirmType: 'switch',
    callback: ({ row }) => {
      staffUpdateData({ id: row.id, staffStatus: row.staffStatus === 1 ? 0 : 1 })
        .then(() => {
          if (row.staffStatus === 1) {
            staffResetRedisLoginTime({ id: row.id });
          }
          searchCallback();
        });
    },
    permission: { code: '1-6-2-3', name: 'staff-switch-status' },
  },
  {
    name: '????????????',
    icon: RefreshLeft,
    key: 'resetPwd',
    isConfirm: true,
    confirmType: 'resetPwd',
    callback: ({ row }) => {
      staffResetPwd({ id: row.id }).then(() => {
        staffResetRedisLoginTime({ id: row.id });
      });
    },
    permission: { code: '1-6-2-4', name: 'staff-reset-pwd' },
  },
  {
    name: '??????',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row }) => {
      staffDeleteData([row.id]).then(() => {
        staffResetRedisLoginTime({ id: row.id });
        searchCallback();
      });
    },
    permission: { code: '1-6-2-5', name: 'staff-delete' },
  },
];
const tableData = reactive<NormalPageDataType<StaffListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//????????????????????????
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<StaffListType>();
const displayData: SearchColumnType[] = [
  {
    prop: 'orgIds',
    label: '????????????:',
    type: 'cascade',
    span: 11,
    onChange: v => {
      if (v && v.length > 0) {
        roleOptsData(v[v.length - 1]).then(({ data }) => {
          roleIdOpts.value = data;
        });
      }
    },
  },
  {
    prop: 'roleId',
    label: '????????????:',
    type: 'select',
    span: 11,
    onChange: v => {
      addEditData!.value!.roleName = roleIdOpts.value.find(item => item.value === v)?.label;
    },
  },
  { prop: 'roleName', label: '?????????:', type: 'input', hide: true },
  { prop: 'username', label: '??????:', type: 'input', span: 11 },
  { prop: 'nickname', label: '??????:', type: 'input', span: 11 },
  { prop: 'mobile', label: '?????????:', type: 'input', span: 11 },
  { prop: 'email', label: '??????:', type: 'input', span: 11 },
  { prop: 'inviteCode', label: '?????????:', type: 'input', span: 11 },
  {
    prop: 'superId',
    label: '????????????:',
    type: 'select',
    span: 11,
    onChange: v => {
      addEditData!.value!.superName = superIdOpts.value.find(item => item.value === v)?.label;
    },
  },
  { prop: 'superName', label: '????????????:', type: 'select', hide: true },
  {
    prop: 'sortNo',
    label: '?????????',
    type: 'number',
    min: -9999,
    options: { symbol: '', precision: '0' },
    onChange: (v) => addEditData.value!.sortNo = v,
    span: 11,
  },
  { prop: 'staffStatus', label: '??????:', type: 'radio', span: 11 },
  { prop: 'remark', label: '????????????:', type: 'textArea' },
];
const formRules = {
  orgIds: [
    { required: true, message: '???????????????', trigger: 'blur' },
  ],
  roleId: [
    { required: true, message: '???????????????', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 16, message: '????????????4~16??????', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => usernameCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur'
    },
  ],
  nickname: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 2, max: 16, message: '????????????4~16??????', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => nicknameCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur'
    },
  ],
  mobile: [
    { required: true, message: '??????????????????', trigger: 'blur' },
    { max: 16, message: '????????????????????????16', trigger: 'blur' },
  ],
  email: [
    { max: 64, message: '?????????????????????64', trigger: 'blur' },
  ],
  sortNo: [
    { required: true, message: '??????????????????', trigger: 'blur' },
  ],
  remark: [
    { max: 64, message: '????????????????????????64', trigger: 'blur' },
  ],
  staffStatus: [
    { required: true, message: '???????????????', trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { code: '1-6-3-1', name: 'button-cancel-submit' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { code: '1-6-3-2', name: 'button-ensure-submit' },
    onClick: async () => {
      const { value: data } = addEditData
      const extraData: {
        orgId?: number;
        tierLevel?: number;
      } = {};
      //??????????????????????????????
      if (!data?.orgIds || data.orgIds.length === 0) {
        extraData.orgId = 0;
        extraData.tierLevel = 0;
      } else {
        extraData.orgId = data.orgIds[data.orgIds.length - 1];
        extraData.tierLevel = data.orgIds.length;
      }
      const submitData: StaffListType = { ...data, ...extraData };
      if (data?.id) {
        await staffUpdateData(submitData);
      } else {
        await staffAddData(submitData);
      }
      addEditModal.value = false;
      addEditEditing.value = false;
      staffSuperData().then(({ data }) => {
        if (data && data.length > 0) {
          superIdOpts.value = data;
        }
      });
      searchCallback();
    },
  },
];

//???????????????
onMounted(() => {
  statusOpts.value = normalStatusOpts;
  isLeafOpts.value = binaryChoiceOpts;
  orgOptsData().then(({ data }) => {
    orgIdOpts.value = data;
  });
  staffSuperData().then(({ data }) => {
    if (data && data.length > 0) {
      superIdOpts.value = data;
    }
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