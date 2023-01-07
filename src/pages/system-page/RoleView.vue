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
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="handleAuthorize"
          v-permission="{ code: '1-5-4-2', name: 'button-cancel-submit' }"
        >
          提 交
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

//筛选栏数据相关
const permOpts = ref<TreeOptType[]>();
const menuOpts = ref<TreeOptType[]>();
const buttonOpts = ref<TreeOptType[]>();
const statusOpts = ref<BaseOptType[]>();
const orgIdOpts = ref<TreeOptType[]>();
const isLeafOpts = ref<BaseOptType[]>();
const roleTypeOpts = ref<BaseOptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'roleCode', placeholder: '名称' },
  { type: 'input', prop: 'roleName', placeholder: '代码' },
  { type: 'select', prop: 'roleStatus', placeholder: '状态' },
  { type: 'cascade', prop: 'orgId', placeholder: '所属部门' },
  {
    type: 'date',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '新建时间(起始)',
    endTimeStr: '新建时间(结束)'
  },
  { type: 'input', prop: 'orgNames', placeholder: '名称(多个)', span: 12 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '1-5-1-1', name: 'role-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '导出(全部)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      roleExportData({ ...searchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '1-5-1-2', name: 'export-role-all' },
  },
  {
    name: '导出(本页)',
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

//表格模块数据相关
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'roleCode', label: '代码', width: 140 },
  { prop: 'roleName', label: '名称', width: 140 },
  { prop: 'roleStatus', label: '状态', enumTrans: valueToLabel },
  { prop: 'isLeaf', label: '是否叶子', enumTrans: valueToLabel },
  { prop: 'sortNo', label: '排序号' },
  { prop: 'scopeKey', label: '权限码' },
  { prop: 'orgName', label: '所属部门' },
  { prop: 'createTime', label: '新建时间', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '修改时间', type: 'date', formatter: dateToString, width: 100 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '详情',
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
    name: '修改',
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
    name: '删除',
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
    name: '授权权限',
    icon: Connection,
    key: 'permission',
    callback: (row: RoleListType) => {
      currentId.value = row.id;
      checkStrictly.value = false;
      authorizeData.value = permOpts.value!;
      rolePerms(row.id!).then(({ data }) => {
        authorizeTitle.value = `授权权限(${row.roleName})`;
        defaultCheckedData.value = data;
        authorizeVisible.value = true;
      });
    },
    permission: { code: '1-5-2-5', name: 'authorize-permission' },
  },
  {
    name: '授权菜单',
    icon: Connection,
    key: 'menu',
    callback: (row: RoleListType) => {
      currentId.value = row.id;
      checkStrictly.value = true;
      authorizeData.value = menuOpts.value!;
      roleMenus(row.id!).then(({ data }) => {
        authorizeTitle.value = `授权菜单(${row.roleName})`;
        defaultCheckedData.value = data;
        authorizeVisible.value = true;
      });
    },
    permission: { code: '1-5-2-6', name: 'authorize-menu' },
  },
  {
    name: '授权按钮',
    icon: Connection,
    key: 'button',
    callback: (row: RoleListType) => {
      currentId.value = row.id;
      checkStrictly.value = false;
      authorizeData.value = buttonOpts.value!;
      roleButtons(row.id!).then(({ data }) => {
        authorizeTitle.value = `授权按钮(${row.roleName})`;
        defaultCheckedData.value = data;
        authorizeVisible.value = true;
      });
    },
    permission: { code: '1-5-2-7', name: 'authorize-button' },
  },
];
const tableData = reactive<NormalPageDataType<RoleListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//弹窗模块数据相关
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<RoleListType>();
const displayData: SearchColumnType[] = [
  { prop: 'orgIds', label: '所属部门:', type: 'cascade', span: 23 },
  {
    prop: 'sortNo',
    label: '排序号',
    type: 'number',
    options: { symbol: '', precision: '0' },
    onChange: (v) => addEditData.value!.sortNo = v,
    span: 11,
  },
  { prop: 'roleCategory', label: '类型:', type: 'select', span: 11 },
  { prop: 'roleCode', label: '代码:', type: 'input', span: 11 },
  { prop: 'roleName', label: '名称:', type: 'input', span: 11 },
  { prop: 'roleDesc', label: '描述:', type: 'textArea' },
  { prop: 'isLeaf', label: '是否叶子:', type: 'radio', span: 8 },
  { prop: 'roleStatus', label: '状态:', type: 'radio', span: 14 },
];
const formRules = {
  orgIdArr: [
    { required: true, message: '请选择部门', trigger: 'blur' },
  ],
  sortNo: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
  ],
  roleCategory: [
    { required: true, message: '请选择类型', trigger: 'blur' },
  ],
  roleCode: [
    { required: true, message: '请输入代码', trigger: 'blur' },
    { min: 4, max: 16, message: '代码长度4~16之间', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => roleCodeCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        orgId: getOrgId()
      }), trigger: 'blur'
    },
  ],
  roleName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 4, max: 16, message: '名称长度4~16之间', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => roleNameCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        orgId: getOrgId()
      }), trigger: 'blur'
    },
  ],
  isLeaf: [
    { required: true, message: '请选择是否叶子', trigger: 'blur' },
  ],
  roleStatus: [
    { required: true, message: '请选择状态', trigger: 'blur' },
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
      //进行输出的重组装处理
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

//角色授权相关
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
  if (authorizeTitle.value?.includes('权限')) {
    const checkedKeys = treeRef.value!.getCheckedKeys(true);
    const rolePerms = checkedKeys.map(item => ({ roleId: currentId.value!, permId: item }));
    roleUpdatePerms(currentId.value!, rolePerms).then(() => authorizeVisible.value = false);
  } else if (authorizeTitle.value?.includes('菜单')) {
    const checkedKeys = treeRef.value!.getCheckedKeys(false);
    const roleMenus = checkedKeys.map(item => ({ roleId: currentId.value!, menuId: item }));
    roleUpdateMenus(currentId.value!, roleMenus).then(() => authorizeVisible.value = false);
  } else if (authorizeTitle.value?.includes('按钮')) {
    const checkedKeys = treeRef.value!.getCheckedKeys(true);
    const roleButtons = checkedKeys.map(item => ({ roleId: currentId.value!, buttonId: item }));
    roleUpdateButtons(currentId.value!, roleButtons).then(() => authorizeVisible.value = false);
  }
};

//生命周函数
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