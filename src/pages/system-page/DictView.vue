<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :other-operates="otherOperates"
        :select-opts="{
          dictStatus: statusOpts,
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
        :operate-perm="{code: '1-7-2', name: 'dict-table'}"
        :select-opts="{
            dictStatus: statusOpts,
        }"
        row-main-prop="dictName"
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
      :radio-opts="{
        dictStatus: statusOpts,
      }"
      :footer-button="footerButton"
      :editing="addEditEditing"
    />

    <el-dialog
      width="80vw"
      class="value-modal"
      :title="valueModalTitle"
      :append-to-body="true"
      :before-close="beforeCloseValueModal"
      :close-on-click-modal="false"
      v-model="valueVisible"
    >
      <div class="value-search">
        <miracle-search
          :search-column="valueSearchColumns"
          :search-data="valueSearchData"
          :other-operates="valueOtherOperates"
          :select-opts="{
            valueStatus: statusOpts,
          }"
          @search-callback="valueSearchCallback"
          @reset-callback="valueResetCallback"
          @create-callback="handleAddValue"
        />
      </div>
      <div class="value-table">
        <miracle-table
          :table-loading="valueTableLoading"
          :table-columns="valueTableColumns"
          :list-data="valueTableData.records"
          :operate-menus="valueOperateMenus"
          :operate-perm="{code: '1-8-2', name: 'value-table'}"
          :select-opts="{
            valueStatus: statusOpts,
        }"
          row-main-prop="valueName"
          row-status-prop="valueStatus"
        >
          <template #footer>
            <el-pagination
              small
              background
              :total="valueTableData.total"
              class="value-table-footer"
              @size-change="valueSearchCallback"
              @current-change="valueSearchCallback"
              v-model:page-size="valueSearchData.size"
              :page-sizes="[5, 10]"
              v-model:current-page="valueSearchData.current"
              :layout="'total, sizes, prev, pager, next, jumper'"
            />
          </template>
        </miracle-table>
      </div>
      <miracle-modal
        :modal-add-edit="valueAddEditModal"
        :add-edit-data="valueAddEditData"
        :display-data="valueDisplayData"
        :form-rules="valueFormRules"
        :select-opts="{
          belongName: belongNameOpts,
          includeIds: goodsTypeOpts,
        }"
        :radio-opts="{
          valueStatus: statusOpts,
        }"
        :footer-button="valueFooterButton"
        :editing="valueAddEditEditing"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch } from "vue";
import { normalStatusOpts } from "@/utils/constant";
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
import { CaretRight, DeleteFilled, Edit, Expand, Switch, View } from "@element-plus/icons-vue";
import { dictCodeCheck, dictNameCheck, valueCodeCheck, valueNameCheck } from "@/validator/system/dict-validator";
import type { DictListType, DictSearchType, ValueListType, ValueSearchType } from "@/type/system/dict-type";
import { dictAddData, dictDeleteData, dictExportData, dictPageData, dictUpdateData } from "@/service/system/dict-api";
import {
  valueAddData,
  valueDeleteData,
  valueExportData,
  valueOptsData,
  valuePageData,
  valueUpdateData
} from "@/service/system/value-api";
import { dateToString, valueToLabel } from "@/utils/transform";

//?????????????????????
const statusOpts = ref<BaseOptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'dictCode', placeholder: '??????' },
  { type: 'input', prop: 'dictName', placeholder: '??????' },
  { type: 'select', prop: 'dictStatus', placeholder: '??????' },
  {
    type: 'date',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '????????????(??????)',
    endTimeStr: '????????????(??????)'
  },
  { type: 'input', prop: 'dictNames', placeholder: '??????(??????)', span: 18 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '1-7-1-1', name: 'dict-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '??????(??????)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      dictExportData({ ...searchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '1-7-1-2', name: 'export-dict-all' },
  },
  {
    name: '??????(??????)',
    key: 'exportPage',
    icon: CaretRight,
    callback: () => {
      dictExportData(searchData.value).then();
    },
    permission: { code: '1-7-1-3', name: 'export-dict-page' },
  },
];
const searchData = ref<DictSearchType>({ current: 1, size: 15 });
const searchCallback = () => {
  tableLoading.value = true;
  dictPageData(searchData.value).then(({ data }) => {
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
    dictStatus: 1
  };
};

//????????????????????????
const tableLoading = ref(false);
const currentDict = ref<DictListType>();
const tableColumns: ListColumnType[] = [
  { prop: 'dictCode', label: '??????' },
  { prop: 'dictName', label: '??????' },
  { prop: 'dictStatus', label: '??????', enumTrans: valueToLabel },
  { prop: 'createTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '??????',
    icon: View,
    key: 'detail',
    callback: (row: DictListType) => {
      row.name = row.dictName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
    permission: { code: '1-7-2-1', name: 'dict-detail' },
  },
  {
    name: '??????',
    icon: Edit,
    key: 'edit',
    callback: (row: DictListType) => {
      row.name = row.dictName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { code: '1-7-2-2', name: 'dict-update' },
  },
  {
    name: '??????',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row }) => {
      dictDeleteData([row.id]).then(() => searchCallback());
    },
    permission: { code: '1-7-2-3', name: 'dict-delete' },
  },
  {
    name: '?????????',
    icon: Expand,
    key: 'value',
    callback: (row: DictListType) => {
      currentDict.value = row;
      valueSearchData.value.dictId = row.id;
      valueModalTitle.value = `${row.dictName}-?????????`;
      valueVisible.value = true;
      valueSearchCallback();
      valueOptsData({ dictName: '????????????' }).then(({ data }) => {
        goodsTypeOpts.value = data;
      });
    },
    permission: { code: '1-7-2-4', name: 'dict-value' },
  },
];
const tableData = reactive<NormalPageDataType<DictListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//????????????????????????
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<DictListType>();
const displayData: SearchColumnType[] = [
  { prop: 'dictCode', label: '??????:', type: 'input', span: 11 },
  { prop: 'dictName', label: '??????:', type: 'input', span: 11 },
  { prop: 'dictStatus', label: '??????:', type: 'radio', span: 14 },
];
const formRules = {
  dictCode: [
    { required: true, message: '???????????????', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => dictCodeCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur'
    },
  ],
  dictName: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 32, message: '????????????4~32??????', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => dictNameCheck(r, v, c, valida, o, addEditData.value?.id), trigger: 'blur'
    },
  ],
  dictStatus: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { code: '1-7-3-1', name: 'dict-cancel-submit' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { code: '1-7-3-2', name: 'dict-ensure-submit' },
    onClick: async () => {
      const { value: data } = addEditData
      if (data?.id) {
        await dictUpdateData(data);
      } else {
        await dictAddData(data!);
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
  searchCallback();
});

//???????????????
const valueVisible = ref(false);
const valueModalTitle = ref("");
const beforeCloseValueModal = () => {
  valueVisible.value = false;
};
const valueSearchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'valueCode', placeholder: '??????' },
  { type: 'input', prop: 'valueName', placeholder: '??????' },
  { type: 'select', prop: 'valueStatus', placeholder: '??????' },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '1-8-1-1', name: 'value-add' } },
];
const valueSearchData = ref<ValueSearchType>({ current: 1, size: 5 });
const valueOtherOperates: OperateMenuType[] = [
  {
    name: '??????(??????)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      valueExportData({ ...valueSearchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '1-8-1-2', name: 'export-value-all' },
  },
  {
    name: '??????(??????)',
    key: 'exportPage',
    icon: CaretRight,
    callback: () => {
      valueExportData(valueSearchData.value).then();
    },
    permission: { code: '1-8-1-3', name: 'export-value-page' },
  },
];
const valueSearchCallback = () => {
  valueTableLoading.value = true;
  valuePageData(valueSearchData.value).then(({ data }) => {
    valueTableData.records = data.records;
    valueTableData.total = data.total;
    valueTableLoading.value = false;
  }).catch(() => valueTableLoading.value = false);
};
const valueResetCallback = () => {
  valueSearchData.value = { current: 1, size: 5, dictId: currentDict.value?.id };
  valueSearchCallback();
};
const handleAddValue = () => {
  valueAddEditModal.value = true;
  valueAddEditEditing.value = true;
  valueAddEditData.value = {
    valueStatus: 1,
  };
};
const valueTableLoading = ref(false);
const valueTableColumns: ListColumnType[] = [
  { prop: 'valueCode', label: '??????' },
  { prop: 'valueName', label: '??????' },
  { prop: 'valueStatus', label: '??????', enumTrans: valueToLabel },
  { prop: 'dictName', label: '????????????' },
  { prop: 'createTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
];
const valueOperateMenus: OperateMenuType[] = [
  {
    name: '??????',
    icon: View,
    key: 'detail',
    callback: (row: ValueListType) => {
      valueAddEditData.value = { ...row, name: row.valueName };
      valueAddEditModal.value = true;
      valueAddEditEditing.value = false;
    },
    permission: { code: '1-8-2-1', name: 'value-detail' },
  },
  {
    name: '??????',
    icon: Edit,
    key: 'edit',
    callback: (row: ValueListType) => {
      valueAddEditData.value = { ...row, name: row.valueName };
      valueAddEditModal.value = true;
      valueAddEditEditing.value = true;
    },
    permission: { code: '1-8-2-2', name: 'value-update' },
  },
  {
    icon: Switch,
    key: 'switchEffect',
    isConfirm: true,
    confirmType: 'switch',
    callback: ({ row }) => {
      valueUpdateData({ id: row.id, valueStatus: row.valueStatus === 1 ? 0 : 1 }).then(() => valueSearchCallback());
    },
    permission: { code: '1-8-2-3', name: 'value-switch-status' },
  },
  {
    name: '??????',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row }) => {
      valueDeleteData([row.id]).then(() => searchCallback());
    },
    permission: { code: '1-8-2-4', name: 'value-delete' },
  },
];
const valueTableData = reactive<NormalPageDataType<DictListType>>({ records: [], total: 0, pages: 0 })

const valueAddEditEditing = ref(false);
const valueAddEditModal = ref(false);
const valueAddEditData = ref<ValueListType>();
const valueDisplayData = ref<SearchColumnType[]>();
const valueFormRules = {
  valueCode: [
    { required: true, message: '???????????????', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => valueCodeCheck(r, v, c, valida, o, {
        id: valueAddEditData.value?.id,
        dictId: currentDict.value?.id
      }), trigger: 'blur'
    },
  ],
  valueName: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 32, message: '????????????4~32??????', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => valueNameCheck(r, v, c, valida, o, {
        id: valueAddEditData.value?.id,
        dictId: currentDict.value?.id
      }), trigger: 'blur'
    },
  ],
  valueStatus: [
    { required: true, message: '????????????????????????', trigger: 'blur' },
  ],
  belongName: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
  includeIds: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
};
const valueFooterButton: AddEditButtonType[] = [
  {
    permission: { code: '1-8-3-1', name: 'value-cancel-submit' },
    onClick: () => {
      valueAddEditModal.value = false;
      valueAddEditEditing.value = false;
    },
  },
  {
    permission: { code: '1-8-3-2', name: 'value-ensure-submit' },
    onClick: async () => {
      const { value: data } = valueAddEditData;
      //??????????????????????????????
      const submitData: ValueListType = { ...data, dictId: currentDict.value?.id, dictName: currentDict.value?.dictName };
      if (data?.id) {
        await valueUpdateData(submitData);
      } else {
        await valueAddData(submitData);
      }
      valueAddEditModal.value = false;
      valueAddEditEditing.value = false;
      valueSearchCallback();
    },
  },
];

const belongNameOpts = ref<BaseOptType[]>();
const goodsTypeOpts = ref<TreeOptType[]>();
watch(() => currentDict.value?.id, (newV) => {
  if (newV === 1) {
    valueDisplayData.value = [
      { prop: 'valueCode', label: '??????:', type: 'input', span: 11 },
      { prop: 'valueName', label: '??????:', type: 'input', span: 11 },
      { prop: 'belongName', label: '????????????:', type: 'select', span: 11, multiple: true,  },
      { prop: 'valueStatus', label: '??????:', type: 'radio', span: 11 },
      { prop: 'includeIds', label: '????????????:', type: 'select', multiple: true, filterable: true, span: 23 },
    ];
    belongNameOpts.value = [
      { value: '??????', label: '??????' },
      { value: '??????', label: '??????' },
    ];
  } else if (newV === 2) {
    valueDisplayData.value = [
      { prop: 'valueCode', label: '??????:', type: 'input', span: 11 },
      { prop: 'valueName', label: '??????:', type: 'input', span: 11 },
      { prop: 'belongName', label: '????????????:', type: 'select', multiple: true, span: 11 },
      { prop: 'valueStatus', label: '??????:', type: 'radio', span: 11 },
    ];
    belongNameOpts.value = [
      { value: '??????', label: '??????' },
      { value: '??????', label: '??????' },
      { value: '??????', label: '??????' },
    ];
  } else {
    valueDisplayData.value = [
      { prop: 'valueCode', label: '??????:', type: 'input', span: 11 },
      { prop: 'valueName', label: '??????:', type: 'input', span: 11 },
      { prop: 'valueStatus', label: '??????:', type: 'radio', span: 14 },
    ];
  }
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

.value-modal {
  .value-table {
    text-align: right;
    &-footer {
      margin-top: 10px;
      margin-left: auto;
    }
  }
}
</style>