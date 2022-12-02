<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :select-opts="{
          menuStatus: statusOpts,
        }"
        :cascade-opts="{
          menuId: menuIdOpts,
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
        :select-opts="{
        menuStatus: statusOpts,
        isLeaf: isLeafOpts,
      }"
        row-main-prop="name"
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
        menuIdArr: menuIdOpts,
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
import { DeleteFilled, Edit, View } from "@element-plus/icons-vue";
import { buttonCodeCheck, buttonNameCheck } from "@/validator/button-validator";
import type { ButtonListType, ButtonSearchType } from "@/type/system/button-type";
import { buttonAddData, buttonDeleteData, buttonPageData, buttonUpdateData } from "@/service/system/button-api";
import { menuOptsData } from "@/service/system/menu-api";

//筛选栏数据相关
const reqMethodOpts = ref<BaseOptType[]>();
const statusOpts = ref<BaseOptType[]>();
const menuIdOpts = ref<TreeOptType[]>();
const isLeafOpts = ref<BaseOptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'code', placeholder: '名称', span: 7 },
  { type: 'input', prop: 'name', placeholder: '代码', span: 7 },
  { type: 'cascade', prop: 'menuId', placeholder: '所属菜单', span: 10 },
  { type: 'input', prop: 'sortNo', placeholder: '所属模块号' },
  { type: 'input', prop: 'names', placeholder: '名称(多个)', span: 12 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '1-4-1-1', name: 'button-add' } },
];
const searchData = ref<ButtonSearchType>({ current: 1, size: 15 });
const searchCallback = () => {
  tableLoading.value = true;
  buttonPageData(searchData.value).then(({ data }) => {
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
  addEditData.value = {};
};

//表格模块数据相关
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'code', label: '代码' },
  { prop: 'name', label: '名称' },
  { prop: 'menuName', label: '所属菜单' },
  { prop: 'sortNo', label: '所属模块号' },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '详情',
    icon: View,
    key: 'detail',
    callback: (row: ButtonListType) => {
      row.menuIdArr = JSON.parse(row.menuIds?.toString() || '[]')
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
    permission: { code: '1-4-2-1', name: 'button-detail' },
  },
  {
    name: '修改',
    icon: Edit,
    key: 'edit',
    callback: (row: ButtonListType) => {
      row.menuIdArr = JSON.parse(row.menuIds?.toString() || '[]')
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { code: '1-4-2-2', name: 'button-update' },
  },
  {
    name: '删除',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row }) => {
      buttonDeleteData([row.id]).then(() => searchCallback());
    },
    permission: { code: '1-4-2-3', name: 'button-delete' },
  },
];
const tableData = reactive<NormalPageDataType<ButtonListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//弹窗模块数据相关
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<ButtonListType>();
const displayData: SearchColumnType[] = [
  { prop: 'menuIdArr', label: '父菜单:', type: 'cascade', span: 11 },
  {
    prop: 'sortNo',
    label: '模块号',
    type: 'number',
    options: { symbol: '', precision: '0' },
    onChange: (v) => addEditData.value!.sortNo = v,
    span: 11
  },
  { prop: 'code', label: '代码:', type: 'input', span: 11 },
  { prop: 'name', label: '名称:', type: 'input', span: 11 },
];
const formRules = {
  code: [
    { required: true, message: '请输入代码', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => buttonCodeCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        menuId: getMenuId()
      }), trigger: 'blur'
    },
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 4, max: 32, message: '名称长度4~32之间', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => buttonNameCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        menuId: getMenuId()
      }), trigger: 'blur'
    },
  ],
  menuIdArr: [
    { required: true, message: '请选择所属菜单', trigger: 'blur' },
  ],
  sortNo: [
    { required: true, message: '请选择所属菜单', trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { code: '1-4-3-1', name: 'button-cancel-submit' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { code: '1-4-3-2', name: 'button-ensure-submit' },
    onClick: async () => {
      const { value: data } = addEditData
      const extraData: {
        menuId?: number;
        menuIds?: string;
        tierLevel?: number;
      } = {};
      //进行输出的重组装处理
      if (!data?.menuIdArr || data.menuIdArr.length === 0) {
        extraData.menuId = 0;
        extraData.menuIds = '[0]';
        extraData.tierLevel = 0;
      } else {
        extraData.menuId = data.menuIdArr[data.menuIdArr.length - 1];
        extraData.menuIds = JSON.stringify(data.menuIdArr);
        extraData.tierLevel = data.menuIdArr.length;
      }
      const submitData: ButtonListType = { ...data, ...extraData };
      if (data?.id) {
        await buttonUpdateData(submitData);
      } else {
        await buttonAddData(submitData);
      }
      addEditModal.value = false;
      addEditEditing.value = false;
      searchCallback();
    },
  },
];
const getMenuId = () => {
  const { menuIdArr } = addEditData.value!;
  return menuIdArr?.[menuIdArr?.length - 1];
};

//生命周函数
onMounted(() => {
  reqMethodOpts.value = requestMethodOpts;
  statusOpts.value = normalStatusOpts;
  isLeafOpts.value = binaryChoiceOpts;
  menuOptsData().then(({ data }) => {
    menuIdOpts.value = data;
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