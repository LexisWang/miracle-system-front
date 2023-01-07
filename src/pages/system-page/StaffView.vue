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

//筛选栏数据相关
const statusOpts = ref<BaseOptType[]>();
const isLeafOpts = ref<BaseOptType[]>();
const orgIdOpts = ref<TreeOptType[]>([]);
const roleIdOpts = ref<BaseOptType[]>([]);
const superIdOpts = ref<BaseOptType[]>([]);
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'username', placeholder: '账号' },
  { type: 'input', prop: 'nickname', placeholder: '昵称' },
  { type: 'select', prop: 'staffStatus', placeholder: '状态' },
  { type: 'cascade', prop: 'orgId', placeholder: '所属部门' },
  {
    type: 'date',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '新建时间(起始)',
    endTimeStr: '新建时间(结束)'
  },
  { type: 'input', prop: 'nicknames', placeholder: '昵称(多个)', span: 12 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '1-6-1-1', name: 'staff-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '导出(全部)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      staffExportData({ ...searchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '1-6-1-2', name: 'export-staff-all' },
  },
  {
    name: '导出(本页)',
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

//表格模块数据相关
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'username', label: '账号' },
  { prop: 'nickname', label: '昵称', width: 100 },
  { prop: 'mobile', label: '手机号', width: 110 },
  { prop: 'orgName', label: '所属部门', width: 100 },
  { prop: 'roleName', label: '角色名称', width: 110 },
  { prop: 'superName', label: '领导姓名' },
  { prop: 'staffStatus', label: '状态', enumTrans: valueToLabel },
  { prop: 'scopeKey', label: '权限码' },
  { prop: 'createTime', label: '新建时间', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '修改时间', type: 'date', formatter: dateToString, width: 100 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '详情',
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
    name: '修改',
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
    name: '密码重置',
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
    name: '删除',
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

//弹窗模块数据相关
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<StaffListType>();
const displayData: SearchColumnType[] = [
  {
    prop: 'orgIds',
    label: '所属部门:',
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
    label: '所属角色:',
    type: 'select',
    span: 11,
    onChange: v => {
      addEditData!.value!.roleName = roleIdOpts.value.find(item => item.value === v)?.label;
    },
  },
  { prop: 'roleName', label: '角色名:', type: 'input', hide: true },
  { prop: 'username', label: '账号:', type: 'input', span: 11 },
  { prop: 'nickname', label: '昵称:', type: 'input', span: 11 },
  { prop: 'mobile', label: '手机号:', type: 'input', span: 11 },
  { prop: 'email', label: '邮箱:', type: 'input', span: 11 },
  { prop: 'inviteCode', label: '邀请码:', type: 'input', span: 11 },
  {
    prop: 'superId',
    label: '关联领导:',
    type: 'select',
    span: 11,
    onChange: v => {
      addEditData!.value!.superName = superIdOpts.value.find(item => item.value === v)?.label;
    },
  },
  { prop: 'superName', label: '关联领导:', type: 'select', hide: true },
  {
    prop: 'sortNo',
    label: '排序号',
    type: 'number',
    min: -9999,
    options: { symbol: '', precision: '0' },
    onChange: (v) => addEditData.value!.sortNo = v,
    span: 11,
  },
  { prop: 'staffStatus', label: '状态:', type: 'radio', span: 11 },
  { prop: 'remark', label: '备注信息:', type: 'textArea' },
];
const formRules = {
  orgIds: [
    { required: true, message: '请选择部门', trigger: 'blur' },
  ],
  roleId: [
    { required: true, message: '请选择角色', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 4, max: 16, message: '账号长度4~16之间', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => usernameCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur'
    },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 16, message: '昵称长度4~16之间', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => nicknameCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur'
    },
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { max: 16, message: '手机号最大长度为16', trigger: 'blur' },
  ],
  email: [
    { max: 64, message: '邮箱最大长度为64', trigger: 'blur' },
  ],
  sortNo: [
    { required: true, message: '请选择排序号', trigger: 'blur' },
  ],
  remark: [
    { max: 64, message: '备注信息大长度为64', trigger: 'blur' },
  ],
  staffStatus: [
    { required: true, message: '请选择状态', trigger: 'blur' },
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
      //进行输出的重组装处理
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

//生命周函数
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