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
              :page-sizes="[15, 30, 50, 100]"
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

//筛选栏数据相关
const statusOpts = ref<BaseOptType[]>();
const creditOpts = ref<BaseOptType[]>();
const salesmanOpts = ref<BaseOptType[]>();
const serviceOpts = ref<BaseOptType[]>();
const categoryOpts = ref<BaseOptType[]>();
const pathwayOpts = ref<TreeOptType[]>();
const rankOpts = ref<BaseOptType[]>();
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'consignorCode', placeholder: '入仓号' },
  { type: 'input', prop: 'consignorName', placeholder: '客户名' },
  { type: 'input', prop: 'sortCode', placeholder: '网销编号' },
  { type: 'select', prop: 'consignorStatus', placeholder: '状态' },
  { type: 'select', prop: 'creditStatus', placeholder: '诚信等级' },
  { type: 'select', prop: 'salesmanId', placeholder: '原始业务' },
  { type: 'select', prop: 'toSalesmanId', placeholder: '接手业务' },
  { type: 'select', prop: 'lastSalesmanId', placeholder: '实际业务' },
  { type: 'select', prop: 'serviceId', placeholder: '关务员' },
  { type: 'select', prop: 'categoryId', placeholder: '客户类型' },
  {
    type: 'date-picker',
    prop: 'firstOrderTime',
    placeholder: '',
    startTimeStr: '首单时(起始)',
    endTimeStr: '首单时间(结束)'
  },
  {
    type: 'date-picker',
    prop: 'lastOrderTime',
    placeholder: '',
    startTimeStr: '末单时(起始)',
    endTimeStr: '末单时(结束)'
  },
  { type: 'cascade', prop: 'pathwayIds', placeholder: '获客途径', multiple: false, span: 8 },
  { type: 'input', prop: 'consignorCodes', placeholder: '入仓号(多个)', span: 10 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '2-1-1-1', name: 'consignor-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '导出(全部)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      consignorExportData({ ...searchData.value, current: 1, size: 999999 }).then();
    },
    permission: { code: '2-1-1-2', name: 'export-consignor-all' },
  },
  {
    name: '导出(本页)',
    key: 'exportPage',
    icon: CaretRight,
    callback: () => {
      consignorExportData(searchData.value).then();
    },
    permission: { code: '2-1-1-3', name: 'export-consignor-page' },
  },
];
const searchData = ref<ConsignorSearchType>({ current: 1, size: 15 });
const searchCallback = () => {
  tableLoading.value = true;
  //处理获客途径数据
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

//表格模块数据相关
const tableLoading = ref(false);
const currentConsignor = ref<ConsignorListType>();
const tableColumns: ListColumnType[] = [
  { prop: 'consignorCode', label: '代码', width: 120 },
  { prop: 'consignorName', label: '名称', width: 120 },
  { prop: 'sortCode', label: '网销编号', width: 120 },
  { prop: 'president', label: '负责人', width: 120 },
  { prop: 'phoneNumber', label: '手机号', width: 140 },
  { prop: 'consignorStatus', label: '客户状态', enumTrans: valueToLabel, width: 100 },
  { prop: 'creditStatus', label: '诚信等级', enumTrans: valueToLabel, width: 100 },
  { prop: 'salesmanName', label: '原始业务', width: 140 },
  { prop: 'toSalesmanName', label: '接手业务', width: 140 },
  { prop: 'lastSalesmanName', label: '实际业务', width: 140 },
  { prop: 'serviceName', label: '关务员', width: 140 },
  { prop: 'categoryName', label: '客户性质', width: 100 },
  { prop: 'pathwayName', label: '获客途径', width: 100 },
  { prop: 'firstOrderTime', label: '首单时间', type: 'date', formatter: dateToString, width: 120 },
  { prop: 'lastOrderTime', label: '末单时间', type: 'date', formatter: dateToString, width: 120 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '详情',
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
    name: '修改',
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
    name: '删除',
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
    name: '收货人',
    icon: Expand,
    key: 'consignee',
    callback: (row: ConsignorListType) => {
      currentConsignor.value = row;
      consigneeSearchData.value.consignorId = row.id;
      consigneeModalTitle.value = `${row.consignorCode}-收货人`;
      consigneeVisible.value = true;
      consigneeSearchCallback();
    },
    permission: { code: '2-1-2-5', name: 'consignees' },
  },
  {
    name: '诚信值',
    icon: Expand,
    key: 'credit',
    callback: (row: ConsignorListType) => {
      currentConsignor.value = row;
      consigneeSearchData.value.consignorId = row.id;
      consigneeModalTitle.value = `${row.consignorCode}-诚信值`;
      consigneeVisible.value = true;
      consigneeSearchCallback();
    },
    permission: { code: '2-1-2-5', name: 'consignees' },
  },
];
const tableData = reactive<NormalPageDataType<ConsignorListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//弹窗模块数据相关
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<ConsignorListType>();
const displayData: SearchColumnType[] = [
  { prop: 'consignorCode', label: '入仓号:', type: 'input', span: 7 },
  { prop: 'consignorName', label: '客户名:', type: 'input', span: 7 },
  { prop: 'president', label: '代理人:', type: 'input', span: 7 },
  { prop: 'phoneNumber', label: '手机号:', type: 'input', span: 7 },
  { prop: 'wechatNumber', label: '微信号:', type: 'input', span: 7 },
  { prop: 'qqNumber', label: 'QQ号:', type: 'input', span: 7 },
  { prop: 'otherNumber', label: '其他联系:', type: 'input', span: 7 },
  { prop: 'salesmanId', label: '原始业务:', type: 'select', span: 7 },
  { prop: 'toSalesmanId', label: '接手业务:', type: 'select', span: 7 },
  { prop: 'serviceId', label: '关务员:', type: 'select', span: 7 },
  { prop: 'categoryId', label: '客户类型:', type: 'select', span: 7 },
  { prop: 'rankId', label: '客户级别:', type: 'select', span: 7 },
  { prop: 'pathwayIds', label: '获客途径:', type: 'cascade', span: 7 },
  { prop: 'profitRate', label: '业绩占比:', type: 'number', options: { symbol: '', precision: '0' }, span: 7 },
  { prop: 'consignorStatus', label: '状态:', type: 'radio', span: 7 },
  { prop: 'address', label: '联系地址:', type: 'textArea', span: 23 },
  { prop: 'consignorRemark', label: '备注信息:', type: 'textArea', span: 23 },
];
const formRules = {
  consignorCode: [
    { required: true, message: '请输入代码', trigger: 'blur' },
    { validator: onlyDigitalOrHyphenValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorCodeCheck(r, v, c, valida, o, addEditData.value?.id),
      trigger: 'blur'
    },
  ],
  consignorName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 4, max: 32, message: '名称长度4~32之间', trigger: 'blur' },
    { validator: notIncludeSpaceValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorNameCheck(r, v, c, valida, o, addEditData.value?.id),
      trigger: 'blur'
    },
  ],
  phoneNumber: [
    // { required: true, message: '请输入代码', trigger: 'blur' },
    { validator: onlyDigitalOrHyphenValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorContactCheck(r, v, c, valida, o, addEditData.value),
      trigger: 'blur'
    },
  ],
  wechatNumber: [
    { validator: notIncludeSpaceValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorContactCheck(r, v, c, valida, o, addEditData.value),
      trigger: 'blur'
    },
  ],
  qqNumber: [
    { validator: onlyDigitalValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorContactCheck(r, v, c, valida, o, addEditData.value),
      trigger: 'blur'
    },
  ],
  otherNumber: [
    { validator: notIncludeSpaceValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consignorContactCheck(r, v, c, valida, o, addEditData.value),
      trigger: 'blur'
    },
  ],
  salesmanId: [
    { required: true, message: '请选择原始业务', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择客户类型', trigger: 'blur' },
  ],
  rankId: [
    { required: true, message: '请选择客户级别', trigger: 'blur' },
  ],
  pathwayIds: [
    { required: true, message: '请选择获客途径', trigger: 'blur' },
  ],
  consignorStatus: [
    { required: true, message: '请选择字典状态', trigger: 'blur' },
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
      //填充选项数据
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

//生命周函数
onMounted(() => {
  statusOpts.value = normalStatusOpts;
  creditOpts.value = creditStatusOpts;
  staffOptsData(roleCategoryOpts[1].value).then(({ data }) => {
    data.unshift({ value: 0, label: '暂无' });
    salesmanOpts.value = data;
  });
  staffOptsData(roleCategoryOpts[2].value).then(({ data }) => {
    data.unshift({ value: 0, label: '暂无' });
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

//收货人相关
const consigneeVisible = ref(false);
const consigneeModalTitle = ref("");
const beforeCloseValueModal = () => {
  consigneeVisible.value = false;
};
const consigneeSearchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'consigneeCode', placeholder: '收货人码)' },
  { type: 'input', prop: 'consigneeName', placeholder: '收货名' },
  { type: 'select', prop: 'consigneeStatus', placeholder: '状态' },
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
  consigneeSearchData.value = { current: 1, size: 10, consignorId: currentConsignor.value?.id };
  searchCallback();
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
  { prop: 'consigneeCode', label: '代码' },
  { prop: 'consigneeName', label: '名称' },
  { prop: 'deliveryMobile', label: '收货电话', width: 120 },
  { prop: 'consigneeStatus', label: '状态', enumTrans: valueToLabel },
  { prop: 'createTime', label: '新建时间', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '修改时间', type: 'date', formatter: dateToString, width: 100 },
];
const consigneeOperateMenus: OperateMenuType[] = [
  {
    name: '详情',
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
    name: '修改',
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
    name: '删除',
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
  { prop: 'consigneeCode', label: '代码:', type: 'input', span: 11 },
  { prop: 'consigneeName', label: '名称:', type: 'input', span: 11 },
  { prop: 'deliveryMobile', label: '收货电话:', type: 'input', span: 11 },
  { prop: 'deliveryMobile1', label: '备用电话:', type: 'input', span: 11 },
  { prop: 'deliveryAddress', label: '收货地址:', type: 'textArea', span: 23 },
  { prop: 'consigneeRemark', label: '备注信息:', type: 'textArea', span: 23 },
  { prop: 'consigneeStatus', label: '状态:', type: 'radio', span: 11 },
]);
const consigneeFormRules = {
  consigneeCode: [
    { required: true, message: '请输入代码', trigger: 'blur' },
    { validator: notIncludeSpaceValid, trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consigneeCodeCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        dictId: currentConsignor.value?.id
      }), trigger: 'blur'
    },
  ],
  consigneeName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { validator: notIncludeSpaceValid, trigger: 'blur' },
    { min: 4, max: 32, message: '名称长度4~32之间', trigger: 'blur' },
    {
      validator: (r: any, v: any, c: any, valida: any, o: any) => consigneeNameCheck(r, v, c, valida, o, {
        id: addEditData.value?.id,
        dictId: currentConsignor.value?.id
      }), trigger: 'blur'
    },
  ],
  deliveryMobile: [
    { validator: onlyDigitalHyphenComma, trigger: 'blur' },
  ],
  deliveryMobile1: [
    { validator: onlyDigitalHyphenComma, trigger: 'blur' },
  ],
  consigneeStatus: [
    { required: true, message: '请选择收货人状态', trigger: 'blur' },
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
      //进行输出的重组装处理
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