<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :other-operates="otherOperates"
        :other-operates-perm="{code: '1-5-1', name: 'role-search'}"
        :select-opts="{
          roleStatus: statusOpts,
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
        :operate-perm="{code: '1-5-2', name: 'role-table'}"
        :select-opts="{
          roleStatus: statusOpts,
          isLeaf: isLeafOpts,
        }"
        row-main-prop="roleName"
        row-status-prop="roleStatus"
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
        roleCategory: roleTypeOpts,
      }"
      :cascade-opts="{
        orgIds: orgIdOpts,
      }"
      :radio-opts="{
        roleStatus: statusOpts,
        isLeaf: isLeafOpts,
      }"
      :footer-button="footerButton"
      :editing="addEditEditing"
    />
    <el-dialog
      width="500"
      :title="authorizeTitle"
      v-model="authorizeVisible"
    >
      <el-tree
        ref="treeRef"
        :data="authorizeData"
        show-checkbox
        node-key="value"
        highlight-current
        :check-strictly="checkStrictly"
        :default-checked-keys="defaultCheckedData"
      />
      <template #footer>
        <el-button
          @click="authorizeVisible = false"
          v-permission="{ code: '1-5-4-1', name: 'button-cancel-submit' }"
        >
          ??? ???
        </el-button>
        <el-button
          type="primary"
          @click="handleAuthorize"
          v-permission="{ code: '1-5-4-2', name: 'button-cancel-submit' }"
        >
          ??? ???
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import { binaryChoiceOpts, normalStatusOpts, roleCategoryOpts } from "@/utils/constant";
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
import { CaretRight, DeleteFilled, Edit, Switch, View, Connection } from "@element-plus/icons-vue";
import { dateToString, valueToLabel } from "@/utils/transform";
import { roleCodeCheck, roleNameCheck } from "@/validator/system/role-validator";
import type { RoleListType, RoleSearchType } from "@/type/system/role-type";
import {
  roleAddData,
  roleDeleteData,
  roleExportData,
  rolePageData,
  roleUpdateData,
  rolePerms,
  roleUpdatePerms,
  roleMenus,
  roleUpdateMenus,
  roleButtons,
  roleUpdateButtons
} from "@/service/system/role-api";
import { orgOptsData } from "@/service/system/org-api";
import { permOptsData } from "@/service/system/perm-api";
import { menuOptsData } from "@/service/system/menu-api";
import { buttonOptsData } from "@/service/system/button-api";
import { ElTree } from "element-plus";

//?????????????????????
const permOpts = ref<TreeOptType[]>();
const menuOpts = ref<TreeOptType[]>();
const buttonOpts = ref<TreeOptType[]>();
const statusOpts = ref<BaseOptType[]>();
const orgIdOpts = ref<TreeOptType[]>();
const isLeafOpts = ref<BaseOptType[]>();
const roleTypeOpts = ref<BaseOptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'roleCode', placeholder: '??????' },
  { type: 'input', prop: 'roleName', placeholder: '??????' },
  { type: 'select', prop: 'roleStatus', placeholder: '??????' },
  { type: 'cascade', prop: 'orgId', placeholder: '????????????' },
  {
    type: 'date',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '????????????(??????)',
    endTimeStr: '????????????(??????)'
  },
  { type: 'input', prop: 'orgNames', placeholder: '??????(??????)', span: 12 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '1-5-1-1', name: 'role-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '??????(??????)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      roleExportData({ ...searchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '1-5-1-2', name: 'export-role-all' },
  },
  {
    name: '??????(??????)',
    key: 'exportPage',
    icon: CaretRight,
    callback: () => {
      roleExportData(searchData.value).then();
    },
    permission: { code: '1-5-1-3', name: 'export-role-page' },
  },
];
const searchData = ref<RoleSearchType>({ current: 1, size: 15 });
const searchCallback = () => {
  tableLoading.value = true;
  rolePageData(searchData.value).then(({ data }) => {
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
  addEditData.value = { roleStatus: 1 };
};

//????????????????????????
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'roleCode', label: '??????', width: 140 },
  { prop: 'roleName', label: '??????', width: 140 },
  { prop: 'roleStatus', label: '??????', enumTrans: valueToLabel },
  { prop: 'isLeaf', label: '????????????', enumTrans: valueToLabel },
  { prop: 'sortNo', label: '?????????' },
  { prop: 'scopeKey', label: '?????????' },
  { prop: 'orgName', label: '????????????' },
  { prop: 'createTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '??????',
    icon: View,
    key: 'detail',
    callback: (row: RoleListType) => {
      row.name = row.roleName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
    permission: { code: '1-5-2-1', name: 'role-detail' },
  },
  {
    name: '??????',
    icon: Edit,
    key: 'edit',
    callback: (row: RoleListType) => {
      row.name = row.roleName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { code: '1-5-2-2', name: 'role-update' },
  },
  {
    icon: Switch,
    key: 'switchEffect',
    isConfirm: true,
    confirmType: 'switch',
    callback: ({ row }) => {
      roleUpdateData({ id: row.id, roleStatus: row.roleStatus === 1 ? 0 : 1 }).then(() => searchCallback());
    },
    permission: { code: '1-5-2-3', name: 'role-switch-status' },
  },
  {
    name: '??????',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row }) => {
      roleDeleteData([row.id]).then(() => searchCallback());
    },
    permission: { code: '1-5-2-4', name: 'role-delete' },
  },
  {
    name: '????????????',
    icon: Connection,
    key: 'permission',
    callback: (row: RoleListType) => {
      currentId.value = row.id;
      checkStrictly.value = false;
      authorizeData.value = permOpts.value!;
      rolePerms(row.id!).then(({ data }) => {
        authorizeTitle.value = `????????????(${row.roleName})`;
        defaultCheckedData.value = data;
        authorizeVisible.value = true;
      });
    },
    permission: { code: '1-5-2-5', name: 'authorize-permission' },
  },
  {
    name: '????????????',
    icon: Connection,
    key: 'menu',
    callback: (row: RoleListType) => {
      currentId.value = row.id;
      checkStrictly.value = true;
      authorizeData.value = menuOpts.value!;
      roleMenus(row.id!).then(({ data }) => {
        authorizeTitle.value = `????????????(${row.roleName})`;
        defaultCheckedData.value = data;
        authorizeVisible.value = true;
      });
    },
    permission: { code: '1-5-2-6', name: 'authorize-menu' },
  },
  {
    name: '????????????',
    icon: Connection,
    key: 'button',
    callback: (row: RoleListType) => {
      currentId.value = row.id;
      checkStrictly.value = false;
      authorizeData.value = buttonOpts.value!;
      roleButtons(row.id!).then(({ data }) => {
        authorizeTitle.value = `????????????(${row.roleName})`;
        defaultCheckedData.value = data;
        authorizeVisible.value = true;
      });
    },
    permission: { code: '1-5-2-7', name: 'authorize-button' },
  },
];
const tableData = reactive<NormalPageDataType<RoleListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//????????????????????????
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<RoleListType>();
const displayData: SearchColumnType[] = [
  { prop: 'orgIds', label: '????????????:', type: 'cascade', span: 23 },
  {
    prop: 'sortNo',
    label: '?????????',
    type: 'number',
    options: { symbol: '', precision: '0' },
    onChange: (v) => addEditData.value!.sortNo = v,
    span: 11,
  },
  { prop: 'roleCategory', label: '??????:', type: 'select', span: 11 },
  { prop: 'roleCode', label: '??????:', type: 'input', span: 11 },
  { prop: 'roleName', label: '??????:', type: 'input', span: 11 },
  { prop: 'roleDesc', label: '??????:', type: 'textArea' },
  { prop: 'isLeaf', label: '????????????:', type: 'radio', span: 8 },
  { prop: 'roleStatus', label: '??????:', type: 'radio', span: 14 },
];
const formRules = {
  orgIdArr: [
    { required: true, message: '???????????????', trigger: 'blur' },
  ],
  sortNo: [
    { required: true, message: '??????????????????', trigger: 'blur' },
  ],
  roleCategory: [
    { required: true, message: '???????????????', trigger: 'blur' },
  ],
  roleCode: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 16, message: '????????????4~16??????', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => roleCodeCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        orgId: getOrgId()
      }), trigger: 'blur'
    },
  ],
  roleName: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 16, message: '????????????4~16??????', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => roleNameCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        orgId: getOrgId()
      }), trigger: 'blur'
    },
  ],
  isLeaf: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
  roleStatus: [
    { required: true, message: '???????????????', trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { code: '1-5-3-1', name: 'button-cancel-submit' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { code: '1-5-3-2', name: 'button-ensure-submit' },
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
      const submitData: RoleListType = { ...data, ...extraData };
      if (data?.id) {
        await roleUpdateData(submitData);
      } else {
        await roleAddData(submitData);
      }
      addEditModal.value = false;
      addEditEditing.value = false;
      searchCallback();
    },
  },
];
const getOrgId = () => {
  const { orgIds } = addEditData.value!;
  return orgIds?.[orgIds?.length - 1];
};

//??????????????????
const treeRef = ref<InstanceType<typeof ElTree>>()
const authorizeVisible = ref(false);
const authorizeData = ref<TreeOptType[]>([
  {
    value: 1,
    label: 'Level one 1',
    children: [
      {
        value: 4,
        label: 'Level two 1-1',
        children: [
          {
            value: 9,
            label: 'Level three 1-1-1',
          },
          {
            value: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    value: 2,
    label: 'Level one 2',
    children: [
      {
        value: 5,
        label: 'Level two 2-1',
      },
      {
        value: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    value: 3,
    label: 'Level one 3',
    children: [
      {
        value: 7,
        label: 'Level two 3-1',
      },
      {
        value: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]);
const defaultCheckedData = ref<BaseOptType[]>();
const authorizeTitle = ref<string>();
const checkStrictly = ref<boolean>();
const currentId = ref<number>();
const handleAuthorize = () => {
  if (authorizeTitle.value?.includes('??????')) {
    const checkedKeys = treeRef.value!.getCheckedKeys(true);
    const rolePerms = checkedKeys.map(item => ({ roleId: currentId.value!, permId: item }));
    roleUpdatePerms(currentId.value!, rolePerms).then(() => authorizeVisible.value = false);
  } else if (authorizeTitle.value?.includes('??????')) {
    const checkedKeys = treeRef.value!.getCheckedKeys(false);
    const roleMenus = checkedKeys.map(item => ({ roleId: currentId.value!, menuId: item }));
    roleUpdateMenus(currentId.value!, roleMenus).then(() => authorizeVisible.value = false);
  } else if (authorizeTitle.value?.includes('??????')) {
    const checkedKeys = treeRef.value!.getCheckedKeys(true);
    const roleButtons = checkedKeys.map(item => ({ roleId: currentId.value!, buttonId: item }));
    roleUpdateButtons(currentId.value!, roleButtons).then(() => authorizeVisible.value = false);
  }
};

//???????????????
onMounted(() => {
  statusOpts.value = normalStatusOpts;
  isLeafOpts.value = binaryChoiceOpts;
  roleTypeOpts.value = roleCategoryOpts;
  orgOptsData().then(({ data }) => {
    orgIdOpts.value = data;
  });
  permOptsData().then(({ data }) => {
    permOpts.value = data;
  });
  menuOptsData().then(({ data }) => {
    menuOpts.value = data;
  });
  buttonOptsData().then(({ data }) => {
    buttonOpts.value = data;
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