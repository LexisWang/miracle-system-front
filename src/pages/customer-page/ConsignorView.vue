<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :other-operates="otherOperates"
        :select-opts="{
          consignorStatus: statusOpts,
          creditStatus: creditOpts,
          salesmanId: salesmanOpts,
          toSalesmanId: salesmanOpts,
          lastSalesmanId: salesmanOpts,
          serviceId: serviceOpts,
          categoryId: categoryOpts,
        }"
        :cascade-opts="{
          pathwayIds: pathwayOpts,
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
        :operate-perm="{code: '2-1-2', name: 'consignor-table'}"
        :select-opts="{
            consignorStatus: statusOpts,
            creditStatus: creditOpts,
        }"
        row-main-prop="consignorCode"
        row-status-prop="consignorStatus"
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
      :width="1200"
      :modal-add-edit="addEditModal"
      :add-edit-data="addEditData"
      :display-data="displayData"
      :form-rules="formRules"
      :select-opts="{
        salesmanId: salesmanOpts,
        toSalesmanId: salesmanOpts,
        lastSalesmanId: salesmanOpts,
        serviceId: serviceOpts,
        categoryId: categoryOpts,
        rankId: rankOpts,
      }"
      :cascade-opts="{
        pathwayIds: pathwayOpts,
      }"
      :radio-opts="{
        consignorStatus: statusOpts,
      }"
      :footer-button="footerButton"
      :editing="addEditEditing"
    />

    <el-dialog
      width="80vw"
      class="consignee-modal"
      :title="consigneeModalTitle"
      :append-to-body="true"
      :before-close="beforeCloseValueModal"
      :close-on-click-modal="false"
      v-model="consigneeVisible"
    >
      <div class="consignee-search">
        <miracle-search
          :search-column="consigneeSearchColumns"
          :search-data="consigneeSearchData"
          :select-opts="{
            consigneeStatus: statusOpts,
          }"
          @search-callback="consigneeSearchCallback"
          @reset-callback="consigneeResetCallback"
          @create-callback="handleAddConsignee"
        />
      </div>
      <div class="consignee-table">
        <miracle-table
          :table-loading="consigneeTableLoading"
          :table-columns="consigneeTableColumns"
          :list-data="consigneeTableData.records"
          :operate-menus="consigneeOperateMenus"
          :operate-perm="{code: '2-2-2', name: 'consignee-table'}"
          :select-opts="{
            consigneeStatus: statusOpts,
        }"
          row-main-prop="consigneeName"
          row-status-prop="consigneeStatus"
        >
          <template #footer>
            <el-pagination
              small
              background
              :total="consigneeTableData.total"
              class="consignee-table-footer"
              @size-change="consigneeSearchCallback"
              @current-change="consigneeSearchCallback"
              v-model:page-size="consigneeSearchData.size"
              :page-sizes="[5, 10]"
              v-model:current-page="consigneeSearchData.current"
              :layout="'total, sizes, prev, pager, next, jumper'"
            />
          </template>
        </miracle-table>
      </div>
      <miracle-modal
        :modal-add-edit="consigneeAddEditModal"
        :add-edit-data="consigneeAddEditData"
        :display-data="consigneeDisplayData"
        :form-rules="consigneeFormRules"
        :radio-opts="{
          consigneeStatus: statusOpts,
        }"
        :footer-button="consigneeFooterButton"
        :editing="consigneeAddEditEditing"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import { creditStatusOpts, dictValueOpts, normalStatusOpts, roleCategoryOpts } from "@/utils/constant";
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
import {
  notIncludeSpaceValid,
  onlyDigitalHyphenComma,
  onlyDigitalOrHyphenValid,
  onlyDigitalValid
} from '@/validator/comm-validator';
import {
  consignorCodeCheck,
  consignorContactCheck,
  consignorNameCheck
} from "@/validator/customer/consignor-validator";
import { consigneeCodeCheck, consigneeNameCheck } from "@/validator/customer/consignee-validator";
import type { ConsignorListType, ConsignorSearchType } from "@/type/customer/consignor-type";
import type { ConsigneeListType, ConsigneeSearchType } from "@/type/customer/consignee-type";
import {
  consignorAddData,
  consignorDeleteData,
  consignorExportData,
  consignorPageData,
  consignorUpdateData
} from "@/service/customer/consignor-api";
import {
  consigneeAddData,
  consigneeDeleteData,
  consigneePageData,
  consigneeUpdateData
} from "@/service/customer/consignee-api";
import { dateToString, valueToLabel } from "@/utils/transform";
import { staffOptsData } from "@/service/system/staff-api";
import { valueOptsData } from "@/service/system/value-api";

//?????????????????????
const statusOpts = ref<BaseOptType[]>();
const creditOpts = ref<BaseOptType[]>();
const salesmanOpts = ref<BaseOptType[]>();
const serviceOpts = ref<BaseOptType[]>();
const categoryOpts = ref<BaseOptType[]>();
const pathwayOpts = ref<TreeOptType[]>();
const rankOpts = ref<BaseOptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'consignorCode', placeholder: '?????????' },
  { type: 'input', prop: 'consignorName', placeholder: '?????????' },
  { type: 'input', prop: 'sortCode', placeholder: '????????????' },
  { type: 'select', prop: 'consignorStatus', placeholder: '??????' },
  { type: 'select', prop: 'creditStatus', placeholder: '????????????' },
  { type: 'select', prop: 'salesmanId', placeholder: '????????????' },
  { type: 'select', prop: 'toSalesmanId', placeholder: '????????????' },
  { type: 'select', prop: 'lastSalesmanId', placeholder: '????????????' },
  { type: 'select', prop: 'serviceId', placeholder: '?????????' },
  { type: 'select', prop: 'categoryId', placeholder: '????????????' },
  {
    type: 'date',
    prop: 'firstOrderTime',
    placeholder: '',
    startTimeStr: '?????????(??????)',
    endTimeStr: '????????????(??????)'
  },
  {
    type: 'date',
    prop: 'lastOrderTime',
    placeholder: '',
    startTimeStr: '?????????(??????)',
    endTimeStr: '?????????(??????)'
  },
  { type: 'cascade', prop: 'pathwayIds', placeholder: '????????????', multiple: false, span: 8 },
  { type: 'input', prop: 'consignorCodes', placeholder: '?????????(??????)', span: 10 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '2-1-1-1', name: 'consignor-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '??????(??????)',
    key: 'exportPage',
    icon: CaretRight,
    callback: () => {
      consignorExportData(searchData.value).then();
    },
    permission: { code: '2-1-1-2', name: 'export-consignor-page' },
  },
  {
    name: '??????(??????)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      consignorExportData({ ...searchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '2-1-1-3', name: 'export-consignor-all' },
  },
  {
    name: '??????(?????????)',
    key: 'exportAllChildren',
    icon: CaretRight,
    callback: () => {
      consignorExportData({ ...searchData.value, current: 1, size: 999999, includeConsignee: true }).then();
    },
    permission: { code: '2-1-1-4', name: 'export-consignor-children' },
  },
];
const searchData = ref<ConsignorSearchType>({ current: 1, size: 15 });
const searchCallback = () => {
  tableLoading.value = true;
  //????????????????????????
  const { pathwayIds } = searchData.value;
  if (pathwayIds && pathwayIds.length > 0) {
    if (pathwayIds.length === 1) {
      searchData.value.pathwayId = pathwayIds[0];
    } else if (pathwayIds.length === 2) {
      searchData.value.pathwayChildId = pathwayIds[1];
    } else if (pathwayIds.length === 3) {
      searchData.value.pathwayDetailId = pathwayIds[2];
    }
  } else {
    searchData.value.pathwayId = undefined;
  }
  consignorPageData(searchData.value).then(({ data }) => {
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
    consignorStatus: 1
  };
};

//????????????????????????
const tableLoading = ref(false);
const currentConsignor = ref<ConsignorListType>();
const tableColumns: ListColumnType[] = [
  { prop: 'consignorCode', label: '??????', width: 120 },
  { prop: 'consignorName', label: '??????', width: 120 },
  { prop: 'sortCode', label: '????????????', width: 120 },
  { prop: 'president', label: '?????????', width: 120 },
  { prop: 'phoneNumber', label: '?????????', width: 140 },
  { prop: 'consignorStatus', label: '????????????', enumTrans: valueToLabel, width: 100 },
  { prop: 'creditStatus', label: '????????????', enumTrans: valueToLabel, width: 100 },
  { prop: 'salesmanName', label: '????????????', width: 140 },
  { prop: 'toSalesmanName', label: '????????????', width: 140 },
  { prop: 'lastSalesmanName', label: '????????????', width: 140 },
  { prop: 'serviceName', label: '?????????', width: 140 },
  { prop: 'categoryName', label: '????????????', width: 100 },
  { prop: 'pathwayName', label: '????????????', width: 100 },
  { prop: 'firstOrderTime', label: '????????????', type: 'date', formatter: dateToString, width: 120 },
  { prop: 'lastOrderTime', label: '????????????', type: 'date', formatter: dateToString, width: 120 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '??????',
    icon: View,
    key: 'detail',
    callback: (row: ConsignorListType) => {
      row.name = row.consignorCode;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
    permission: { code: '2-1-2-1', name: 'consignor-detail' },
  },
  {
    name: '??????',
    icon: Edit,
    key: 'edit',
    callback: (row: ConsignorListType) => {
      row.name = row.consignorCode;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { code: '2-1-2-2', name: 'consignor-update' },
  },
  {
    icon: Switch,
    key: 'switchEffect',
    isConfirm: true,
    confirmType: 'switch',
    callback: ({ row }) => {
      consignorUpdateData({
        id: row.id, isUpdateStatus: true,
        consignorStatus: row.consignorStatus === 1 ? 0 : 1
      }).then(() => searchCallback());
    },
    permission: { code: '2-1-2-3', name: 'value-switch-status' },
  },
  {
    name: '??????',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row }) => {
      consignorDeleteData([row.id]).then(() => searchCallback());
    },
    permission: { code: '2-1-2-4', name: 'consignor-delete' },
  },
  {
    name: '?????????',
    icon: Expand,
    key: 'consignee',
    callback: (row: ConsignorListType) => {
      currentConsignor.value = row;
      consigneeSearchData.value.consignorId = row.id;
      consigneeModalTitle.value = `${row.consignorCode}-?????????`;
      consigneeVisible.value = true;
      consigneeSearchCallback();
    },
    permission: { code: '2-1-2-5', name: 'consignees' },
  },
  {
    name: '?????????',
    icon: Expand,
    key: 'credit',
    callback: (row: ConsignorListType) => {
      //
    },
    permission: { code: '2-1-2-5', name: 'consignees' },
  },
];
const tableData = reactive<NormalPageDataType<ConsignorListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//????????????????????????
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<ConsignorListType>();
const displayData: SearchColumnType[] = [
  { prop: 'consignorCode', label: '?????????:', type: 'input', span: 7 },
  { prop: 'consignorName', label: '?????????:', type: 'input', span: 7 },
  { prop: 'president', label: '?????????:', type: 'input', span: 7 },
  { prop: 'phoneNumber', label: '?????????:', type: 'input', span: 7 },
  { prop: 'wechatNumber', label: '?????????:', type: 'input', span: 7 },
  { prop: 'qqNumber', label: 'QQ???:', type: 'input', span: 7 },
  { prop: 'otherNumber', label: '????????????:', type: 'input', span: 7 },
  { prop: 'salesmanId', label: '????????????:', type: 'select', span: 7 },
  { prop: 'toSalesmanId', label: '????????????:', type: 'select', span: 7 },
  { prop: 'serviceId', label: '?????????:', type: 'select', span: 7 },
  { prop: 'categoryId', label: '????????????:', type: 'select', span: 7 },
  { prop: 'rankId', label: '????????????:', type: 'select', span: 7 },
  { prop: 'pathwayIds', label: '????????????:', type: 'cascade', span: 7 },
  {
    prop: 'profitRate',
    label: '????????????:',
    type: 'number', max: 100,
    options: { symbol: '', precision: '0' },
    placeholder: '??????0-100??????',
    span: 7
  },
  { prop: 'consignorStatus', label: '??????:', type: 'radio', span: 7 },
  { prop: 'address', label: '????????????:', type: 'textArea', span: 23 },
  { prop: 'consignorRemark', label: '????????????:', type: 'textArea', span: 23 },
];
const formRules = {
  consignorCode: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 16, message: '????????????4~16??????', trigger: 'blur' },
    { validator: onlyDigitalOrHyphenValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorCodeCheck(r, v, c, valida, o, addEditData.value?.id),
      trigger: 'blur'
    },
  ],
  consignorName: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 32, message: '????????????4~32??????', trigger: 'blur' },
    { validator: notIncludeSpaceValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorNameCheck(r, v, c, valida, o, addEditData.value?.id),
      trigger: 'blur'
    },
  ],
  phoneNumber: [
    { max: 16, message: '???????????????????????????16', trigger: 'blur' },
    { validator: onlyDigitalOrHyphenValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorContactCheck(r, v, c, valida, o, addEditData.value),
      trigger: 'blur'
    },
  ],
  wechatNumber: [
    { max: 24, message: '????????????????????????24', trigger: 'blur' },
    { validator: notIncludeSpaceValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorContactCheck(r, v, c, valida, o, addEditData.value),
      trigger: 'blur'
    },
  ],
  qqNumber: [
    { max: 16, message: 'QQ??????????????????16', trigger: 'blur' },
    { validator: onlyDigitalValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorContactCheck(r, v, c, valida, o, addEditData.value),
      trigger: 'blur'
    },
  ],
  otherNumber: [
    { max: 24, message: '??????????????????4~24??????', trigger: 'blur' },
    { validator: notIncludeSpaceValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorContactCheck(r, v, c, valida, o, addEditData.value),
      trigger: 'blur'
    },
  ],
  salesmanId: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
  rankId: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
  pathwayIds: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
  consignorStatus: [
    { required: true, message: '?????????????????????', trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { code: '2-1-3-1', name: 'consignor-cancel-submit' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { code: '2-1-3-2', name: 'consignor-ensure-submit' },
    onClick: async () => {
      const { value: data } = addEditData
      //??????????????????
      data!.salesmanName = salesmanOpts.value?.find(item => item.value === data?.salesmanId)?.label;
      data!.toSalesmanName = salesmanOpts.value?.find(item => item.value === data?.toSalesmanId)?.label;
      data!.serviceName = serviceOpts.value?.find(item => item.value === data?.serviceId)?.label;
      data!.categoryName = categoryOpts.value?.find(item => item.value === data?.categoryId)?.label;
      data!.rankName = rankOpts.value?.find(item => item.value === data?.rankId)?.label;
      const pathwayIds = data?.pathwayIds
      if (pathwayIds && pathwayIds.length > 0) {
        const { value: pathwayOptsData } = pathwayOpts;
        const pathwayItem = pathwayOptsData?.find(item => item.value === pathwayIds[0]);
        data!.pathwayId = pathwayItem?.value;
        data!.pathwayName = pathwayItem?.label;
        if (pathwayIds.length === 2) {
          const childItem = pathwayItem?.children?.find(item => item.value === pathwayIds[1]);
          data!.pathwayChildId = childItem?.value;
          data!.pathwayChildName = childItem?.label;
        } else if (pathwayIds.length === 3) {
          const childItem = pathwayItem?.children?.find(item => item.value === pathwayIds[1]);
          data!.pathwayChildId = childItem?.value;
          data!.pathwayChildName = childItem?.label;
          const detailItem = childItem?.children?.find(item => item.value === pathwayIds[2]);
          data!.pathwayDetailId = detailItem?.value;
          data!.pathwayDetailName = detailItem?.label;
        }
      }
      if (data?.id) {
        await consignorUpdateData(data);
      } else {
        await consignorAddData(data!);
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
  creditOpts.value = creditStatusOpts;
  staffOptsData(roleCategoryOpts[1].value).then(({ data }) => {
    data.unshift({ value: 0, label: '??????' });
    salesmanOpts.value = data;
  });
  staffOptsData(roleCategoryOpts[2].value).then(({ data }) => {
    data.unshift({ value: 0, label: '??????' });
    serviceOpts.value = data;
  });
  valueOptsData({ dictName: dictValueOpts[4].label }).then(({ data }) => {
    categoryOpts.value = data;
  });
  valueOptsData({ dictName: dictValueOpts[3].label, isTree: true }).then(({ data }) => {
    pathwayOpts.value = data;
  });
  valueOptsData({ dictName: dictValueOpts[6].label }).then(({ data }) => {
    rankOpts.value = data;
  });
  searchCallback();
});

//???????????????
const consigneeVisible = ref(false);
const consigneeModalTitle = ref("");
const beforeCloseValueModal = () => {
  consigneeVisible.value = false;
};
const consigneeSearchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'consigneeCode', placeholder: '????????????)' },
  { type: 'input', prop: 'consigneeName', placeholder: '?????????' },
  { type: 'select', prop: 'consigneeStatus', placeholder: '??????' },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '2-2-1-1', name: 'consignee-add' } },
];
const consigneeSearchData = ref<ConsigneeSearchType>({ current: 1, size: 5 });
const consigneeSearchCallback = () => {
  consigneeTableLoading.value = true;
  consigneePageData(consigneeSearchData.value).then(({ data }) => {
    consigneeTableData.records = data.records;
    consigneeTableData.total = data.total;
    consigneeTableLoading.value = false;
  }).catch(() => consigneeTableLoading.value = false);
};
const consigneeResetCallback = () => {
  consigneeSearchData.value = { current: 1, size: 5, consignorId: currentConsignor.value?.id };
  consigneeSearchCallback();
};
const handleAddConsignee = () => {
  consigneeAddEditModal.value = true;
  consigneeAddEditEditing.value = true;
  consigneeAddEditData.value = {
    consigneeStatus: 1,
  };
};
const consigneeTableLoading = ref(false);
const consigneeTableColumns: ListColumnType[] = [
  { prop: 'consigneeCode', label: '??????' },
  { prop: 'consigneeName', label: '??????' },
  { prop: 'deliveryMobile', label: '????????????', width: 120 },
  { prop: 'consigneeStatus', label: '??????', enumTrans: valueToLabel },
  { prop: 'createTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '????????????', type: 'date', formatter: dateToString, width: 100 },
];
const consigneeOperateMenus: OperateMenuType[] = [
  {
    name: '??????',
    icon: View,
    key: 'detail',
    callback: (row: ConsigneeListType) => {
      consigneeAddEditData.value = {
        ...row, name: row.consigneeName,
      };
      consigneeAddEditModal.value = true;
      consigneeAddEditEditing.value = false;
    },
    permission: { code: '2-2-2-1', name: 'consignee-detail' },
  },
  {
    name: '??????',
    icon: Edit,
    key: 'edit',
    callback: (row: ConsigneeListType) => {
      consigneeAddEditData.value = {
        ...row, name: row.consigneeName,
      };
      consigneeAddEditModal.value = true;
      consigneeAddEditEditing.value = true;
    },
    permission: { code: '2-2-2-2', name: 'consignee-update' },
  },
  {
    icon: Switch,
    key: 'switchEffect',
    isConfirm: true,
    confirmType: 'switch',
    callback: ({ row }) => {
      consigneeUpdateData({ id: row.id, isUpdateStatus: true,
        consigneeStatus: row.consigneeStatus === 1 ? 0 : 1 }).then(() => consigneeSearchCallback());
    },
    permission: { code: '2-2-2-3', name: 'consignee-switch-status' },
  },
  {
    name: '??????',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row }) => {
      consigneeDeleteData([row.id]).then(() => searchCallback());
    },
    permission: { code: '2-2-2-4', name: 'consignee-delete' },
  },
];
const consigneeTableData = reactive<NormalPageDataType<ConsignorListType>>({ records: [], total: 0, pages: 0 })

const consigneeAddEditEditing = ref(false);
const consigneeAddEditModal = ref(false);
const consigneeAddEditData = ref<ConsigneeListType>();
const consigneeDisplayData = ref<SearchColumnType[]>([
  { prop: 'consigneeCode', label: '??????:', type: 'input', span: 11 },
  { prop: 'consigneeName', label: '??????:', type: 'input', span: 11 },
  { prop: 'deliveryMobile', label: '????????????:', type: 'input', span: 11 },
  { prop: 'deliveryMobile1', label: '????????????:', type: 'input', span: 11 },
  { prop: 'deliveryAddress', label: '????????????:', type: 'textArea', span: 23 },
  { prop: 'consigneeRemark', label: '????????????:', type: 'textArea', span: 23 },
  { prop: 'consigneeStatus', label: '??????:', type: 'radio', span: 11 },
]);
const consigneeFormRules = {
  consigneeCode: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 16, message: '????????????4~16??????', trigger: 'blur' },
    { validator: notIncludeSpaceValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consigneeCodeCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        dictId: currentConsignor.value?.id
      }), trigger: 'blur'
    },
  ],
  consigneeName: [
    { required: true, message: '???????????????', trigger: 'blur' },
    { min: 4, max: 32, message: '????????????4~32??????', trigger: 'blur' },
    { validator: notIncludeSpaceValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consigneeNameCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        dictId: currentConsignor.value?.id
      }), trigger: 'blur'
    },
  ],
  deliveryMobile: [
    { max: 32, message: '???????????????????????????32', trigger: 'blur' },
    { validator: onlyDigitalHyphenComma, trigger: 'blur' },
  ],
  deliveryMobile1: [
    { max: 16, message: '???????????????????????????16', trigger: 'blur' },
    { validator: onlyDigitalOrHyphenValid, trigger: 'blur' },
  ],
  consigneeStatus: [
    { required: true, message: '????????????????????????', trigger: 'blur' },
  ],
};
const consigneeFooterButton: AddEditButtonType[] = [
  {
    permission: { code: '2-2-3-1', name: 'consignee-cancel-submit' },
    onClick: () => {
      consigneeAddEditModal.value = false;
      consigneeAddEditEditing.value = false;
    },
  },
  {
    permission: { code: '2-2-3-2', name: 'consignee-ensure-submit' },
    onClick: async () => {
      const { value: data } = consigneeAddEditData;
      const { value: consignorItem } = currentConsignor;
      //??????????????????????????????
      const submitData: ConsigneeListType = { ...data, consignorId: consignorItem?.id,
        consignorCode: consignorItem?.consignorCode, consignorName: consignorItem?.consignorName};
      if (data?.id) {
        await consigneeUpdateData(submitData!);
      } else {
        await consigneeAddData(submitData!);
      }
      consigneeAddEditModal.value = false;
      consigneeAddEditEditing.value = false;
      consigneeSearchCallback();
    },
  },
];

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

.consignee-modal {
  .consignee-table {
    text-align: right;

    &-footer {
      margin-top: 10px;
      margin-left: auto;
    }
  }
}
</style>