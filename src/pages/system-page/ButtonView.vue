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
        :operate-perm="{code: '1-4-2', name: 'button-table'}"
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
        menuIds: menuIdOpts,
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
import { buttonCodeCheck, buttonNameCheck } from "@/validator/system/button-validator";
import type { ButtonListType, ButtonSearchType } from "@/type/system/button-type";
import { buttonAddData, buttonDeleteData, buttonPageData, buttonUpdateData } from "@/service/system/button-api";
import { menuOptsData } from "@/service/system/menu-api";

//?????????????????????
const reqMethodOpts = ref<BaseOptType[]>();
const statusOpts = ref<BaseOptType[]>();
const menuIdOpts = ref<TreeOptType[]>();
const isLeafOpts = ref<BaseOptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'code', placeholder: '??????', span: 7 },
  { type: 'input', prop: 'name', placeholder: '??????', span: 7 },
  { type: 'cascade', prop: 'menuId', placeholder: '????????????', span: 10 },
  { type: 'input', prop: 'sortNo', placeholder: '???????????????' },
  { type: 'input', prop: 'names', placeholder: '??????(??????)', span: 12 },
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

//????????????????????????
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'code', label: '??????' },
  { prop: 'name', label: '??????' },
  { prop: 'menuName', label: '????????????' },
  { prop: 'sortNo', label: '???????????????' },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '??????',
    icon: View,
    key: 'detail',
    callback: (row: ButtonListType) => {
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
    permission: { code: '1-4-2-1', name: 'button-detail' },
  },
  {
    name: '??????',
    icon: Edit,
    key: 'edit',
    callback: (row: ButtonListType) => {
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { code: '1-4-2-2', name: 'button-update' },
  },
  {
    name: '??????',
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

//????????????????????????
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<ButtonListType>();
const displayData: SearchColumnType[] = [
  { prop: 'menuIds', label: '?????????:', type: 'cascade', span: 11 },
  {
    prop: 'sortNo',
    label: '?????????',
    type: 'number',
    options: { symbol: '', precision: '0' },
    onChange: (v) => addEditData.value!.sortNo = v,
    span: 11
  },
  { prop: 'code', label: '??????:', type: 'input', span: 11 },
  { prop: 'name', label: '??????:', type: 'input', span: 11 },
];
const formRules = {
  code: [
    { required: true, message: '???????????????', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => buttonCodeCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        menuId: getMenuId()
      }), trigger: 'blur'
    },
  ],
  name: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 32, message: '????????????4~32??????', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => buttonNameCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        menuId: getMenuId()
      }), trigger: 'blur'
    },
  ],
  menuIds: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
  sortNo: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
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
        tierLevel?: number;
      } = {};
      //??????????????????????????????
      if (!data?.menuIds || data.menuIds.length === 0) {
        extraData.menuId = 0;
        extraData.tierLevel = 0;
      } else {
        extraData.menuId = data.menuIds[data.menuIds.length - 1];
        extraData.tierLevel = data.menuIds.length;
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
  const { menuIds } = addEditData.value!;
  return menuIds?.[menuIds?.length - 1];
};

//???????????????
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