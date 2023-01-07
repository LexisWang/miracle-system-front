<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :other-operates="otherOperates"
        :select-opts="{
          consignorId: consignors,
          orderStatus: orderStatusOpts,
          isHold: isHoldOpts,
          auditorId: auditorsOpts,
          salesmanId: salesmanOpts,
          serviceId: serviceOpts,
          channelId: channelOpts,
          goodTypeId: goodTypeOpts,
          saleCategory: saleCategoryOpts,
          categoryId: categoryOpts,
        }"
        :cascade-opts="{
          pathwayIds: pathwayOpts,
        }"
        :suggest-opts="{
          transSite: transSiteOpts,
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
        :operate-perm="{code: '2-1-2', name: 'order-table'}"
        :select-opts="{
            orderStatus: orderStatusOpts,
            isHold: isHoldOpts,
        }"
        row-main-prop="orderCode"
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
            :page-sizes="[10, 20, 50, 100]"
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
        channelId: channelOpts,
        channelCategory: transWayOpts,
        consignorId: consignors,
        parentId: parentCodeOpts,
        goodTypeId: goodTypeCreOpts,
        auditorId: auditorsOpts,
        storageManIds: storageManOpts,
        consigneeId: consignees,
      }"
      :suggest-opts="{
        transSite: transSiteOpts,
        shipSite: transSiteOpts,
      }"
      :footer-button="footerButton"
      :editing="addEditEditing"
    >
      <template #halvingLine>
        <hr/>
      </template>
      <template #children>
        <h2>货物列表</h2>
        <hr/>
        <dynamic-table
          :editing="addEditEditing"
          ref="dynTableRef"
          :table-data="cargoData"
          :table-columns="cargoColumns"
          @reset-sum-row="resetSumRowData"
          @handle-calculate="handleCalculate"
        />
      </template>
    </miracle-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch, watchEffect } from "vue";
import MiracleTable from '@/pages/components/MiracleTable.vue';
import MiracleSearch from '@/pages/components/MiracleSearch.vue';
import MiracleModal from '@/pages/components/MiracleModal.vue';
import DynamicTable from '@/pages/components/DynamicTable.vue';
import type {
  AddEditButtonType,
  BaseOptType,
  ListColumnType,
  NormalPageDataType,
  OperateMenuType,
  SearchColumnType,
  TreeOptType
} from "@/type/base-type";
import {
  cargoPageData,
  orderAddData,
  orderDeleteData,
  orderPageData,
  orderUpdateData
} from "@/service/business/normal-order-api";
import type { NormalOrderListType, NormalOrderSearchType } from "@/type/business/normal-order-type";
import { CaretRight, DeleteFilled, Edit, View } from "@element-plus/icons-vue";
import { dateToString, valueToLabel } from "@/utils/transform";
import { onlyDigitalValid, onlyFloatNumber } from "@/validator/comm-validator";
import {
  dictValueOpts,
  normalIsHoldOpts,
  normalOrderStatusOpts,
  normalTransSiteOpts,
  normalTransWayOpts,
  roleCategoryOpts,
  salePropertyOpts
} from "@/utils/constant";
import { consignorOpts } from "@/service/customer/consignor-api";
import { staffOptsData } from "@/service/system/staff-api";
import { valueOptsData } from "@/service/system/value-api";
import { consigneeOpts } from "@/service/customer/consignee-api";
import type { CargoItemType } from "@/type/business/normal-cargo-type";

//查询表单数据相关
const consignors = ref<BaseOptType[]>([]);
const consignees = ref<BaseOptType[]>([]);
const orderStatusOpts = ref<BaseOptType[]>([]);
const isHoldOpts = ref<BaseOptType[]>([]);
const auditorsOpts = ref<BaseOptType[]>([]);
const salesmanOpts = ref<BaseOptType[]>([]);
const serviceOpts = ref<BaseOptType[]>([]);
const storageManOpts = ref<BaseOptType[]>([]);
const channelOpts = ref<BaseOptType[]>([]);
const parentCodeOpts = ref<BaseOptType[]>([]);
const transWayOpts = ref<BaseOptType[]>([]);
const goodTypeOpts = ref<BaseOptType[]>([]);
const goodTypeCreOpts = ref<BaseOptType[]>([]);
const saleCategoryOpts = ref<BaseOptType[]>([]);
const categoryOpts = ref<BaseOptType[]>([]);
const pathwayOpts = ref<TreeOptType[]>();
const transSiteOpts = ref<BaseOptType[]>([]);
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'prefixCode', placeholder: '合包号' },
  { type: 'input', prop: 'shippingMark', placeholder: '唛头' },
  { type: 'select', prop: 'consignorId', placeholder: '入仓号' },
  { type: 'select', prop: 'orderStatus', placeholder: '订单状态' },
  { type: 'select', prop: 'isHold', placeholder: '是否HOLD' },
  { type: 'select', prop: 'auditorId', placeholder: '审核员' },
  { type: 'select', prop: 'salesmanId', placeholder: '业务员' },
  { type: 'select', prop: 'serviceId', placeholder: '关务员' },
  { type: 'select', prop: 'channelId', placeholder: '服务渠道' },
  { type: 'select', prop: 'goodTypeId', placeholder: '货物类型' },
  { type: 'autocomplete', prop: 'transSite', placeholder: '入库仓' },
  { type: 'select', prop: 'saleCategory', placeholder: '营销性质' },
  { type: 'select', prop: 'categoryId', placeholder: '客户性质' },
  { type: 'cascade', prop: 'pathwayIds', placeholder: '获客途径', multiple: false },
  { type: 'input', prop: 'consigneeMobile', placeholder: '收货电话' },
  {
    type: 'date',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '录单时(起始)',
    endTimeStr: '录单时间(结束)',
  },
  {
    type: 'date',
    prop: 'packTime',
    placeholder: '',
    startTimeStr: '合单时(起始)',
    endTimeStr: '合单时(结束)'
  },

  { type: 'input', prop: 'orderCodes', placeholder: '订单号(多个)', span: 12 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { code: '3-1-1-1', name: 'order-add' } },
];
const otherOperates: OperateMenuType[] = [
  {
    name: '导出(本页)',
    key: 'exportPage',
    icon: CaretRight,
    callback: () => {
      //
    },
    permission: { code: '3-1-1-2', name: 'export-order-page' },
  },
  {
    name: '导出(全部)',
    key: 'exportAll',
    icon: CaretRight,
    callback: () => {
      //
    },
    permission: { code: '3-1-1-3', name: 'export-order-all' },
  },
  {
    name: '导出(含货物)',
    key: 'exportAllCargo',
    icon: CaretRight,
    callback: () => {
      //
    },
    permission: { code: '3-1-1-4', name: 'export-order-children' },
  },
];
const searchData = ref<NormalOrderSearchType>({ current: 1, size: 10 });
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
  orderPageData(searchData.value).then(({ data }) => {
    records.value = data.records;
    total.value = data.total;
    tableLoading.value = false;
  }).catch(() => tableLoading.value = false);
};
const resetCallback = () => {
  searchData.value = { current: 1, size: 10 };
  searchCallback();
};
const handleAdd = () => {
  addEditModal.value = true;
  addEditEditing.value = true;
  addEditData.value = {
    orderTime: new Date(),
    volWeiRate: 6000,
  };
  cargoData.value = [];
};

//表格模块数据相关
const tableLoading = ref(false);
const tableColumns: ListColumnType[] = [
  { prop: 'orderCode', label: '订单号', width: 100 },
  { prop: 'prefixCode', label: '合包号', width: 120 },
  { prop: 'isHold', label: 'Hold货' },
  { prop: 'salesmanRemark', label: '业务备注', width: 85 },
  { prop: 'unitPrice', label: '单价' },
  { prop: 'goodsKits', label: '件数' },
  { prop: 'goodsWeight', label: '重量' },
  { prop: 'volumeWeight', label: '体积重' },
  { prop: 'priceWeight', label: '收费重' },
  { prop: 'squareNumber', label: '方数' },
  { prop: 'foreignCurrency', label: '外币金额', width: 85 },
  { prop: 'dispatchFee', label: '派送费' },
  { prop: 'vatSar', label: '到付VAT' },
  { prop: 'consignorCode', label: '入仓号' },
  { prop: 'consigneeCode', label: '收货代码', width: 120 },
  { prop: 'shippingMark', label: '唛头' },
  { prop: 'salesmanName', label: '业务员', width: 120 },
  { prop: 'serviceName', label: '关务员', width: 120 },
  { prop: 'auditorName', label: '审核员', width: 120 },
  { prop: 'channelName', label: '服务渠道', width: 140 },
  { prop: 'orderStatus', label: '订单状态', enumTrans: valueToLabel, width: 85 },
  { prop: 'transSite', label: '入库仓' },
  { prop: 'goodTypeName', label: '货物类型', width: 120 },
  { prop: 'saleCategory', label: '营销性质', width: 85 },
  { prop: 'createTime', label: '录单时间', type: 'date', formatter: dateToString, width: 120 },
  { prop: 'packTime', label: '合单时间', type: 'date', formatter: dateToString, width: 120 },
];
const operateMenus: OperateMenuType[] = [
  {
    name: '详情',
    icon: View,
    key: 'detail',
    callback: (row: NormalOrderListType) => {
      row.name = row.consignorCode;
      row.storageManIds = row.storageManIdArr;
      cargoPageData(row.id!).then(({ data }) => {
        cargoData.value = data;
      });
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
    permission: { code: '3-1-2-1', name: 'order-detail' },
  },
  {
    name: '修改',
    icon: Edit,
    key: 'edit',
    callback: (row: NormalOrderListType) => {
      row.name = row.orderCode;
      row.storageManIds = row.storageManIdArr;
      cargoPageData(row.id!).then(({ data }) => {
        cargoData.value = data;
      });
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
    permission: { code: '3-1-2-2', name: 'order-update' },
  },
  {
    name: '删除',
    icon: DeleteFilled,
    key: 'delete',
    isConfirm: true,
    confirmType: 'delete',
    callback: ({ row }) => {
      orderDeleteData([row.id]).then(() => searchCallback());
    },
    permission: { code: '3-1-2-3', name: 'order-delete' },
  },
];
const tableData = reactive<NormalPageDataType<NormalOrderListType>>({ records: [], total: 0, pages: 0 })
const { records, total } = { ...toRefs(tableData) };

//弹窗模块数据相关
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<NormalOrderListType>({});
const displayData: SearchColumnType[] = [
  { prop: 'orderCode', label: '订单号:', type: 'input', span: 7 },
  { prop: 'channelId', label: '服务渠道:', type: 'select', span: 7 },
  { prop: 'channelCategory', label: '运输方式:', type: 'select', span: 7 },
  { prop: 'consignorId', label: '入仓号:', type: 'select', span: 7 },
  { prop: 'parentId', label: '父级单号:', type: 'select', span: 7 },
  { prop: 'deliveryAddress', label: '送仓信息:', type: 'input', span: 7 },
  { prop: 'goodTypeId', label: '货物类型:', type: 'select', span: 7 },
  { prop: 'auditorId', label: '审核员:', type: 'select', span: 7 },
  { prop: 'storageManIds', label: '仓务员:', type: 'select', multiple: true, span: 7 },
  { prop: 'shippingMark', label: '唛头:', type: 'input', span: 7 },
  { prop: 'shippingSpace', label: '仓库区号:', type: 'input', span: 7 },
  { prop: 'orderTime', label: '入库时间:', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss', span: 7 },
  { prop: 'transSite', label: '入库仓:', type: 'autocomplete', span: 7 },
  { prop: 'shipSite', label: '出货仓:', type: 'autocomplete', span: 7 },
  { prop: 'consigneeId', label: '收货人:', type: 'select', span: 7 },
  { prop: 'orderRemark', label: '备注信息:', type: 'textArea', span: 23 },
  { prop: 'volWeiRate', label: '体重比:', type: 'number', options: { symbol: '', precision: '0' }, span: 5 },
  { prop: 'goodsWeight', label: '总重量:', type: 'number', options: { symbol: '', precision: '2' }, span: 5 },
  { prop: 'squareNumber', label: '总方数:', type: 'number', options: { symbol: '', precision: '3' }, span: 5 },
  { prop: 'volumeWeight', label: '体积重:', type: 'number', options: { symbol: '', precision: '2' }, span: 5 },
  { prop: 'singleDeclare', label: '单独报关:', type: 'switch', span: 2 },
  { prop: 'chinaRecords', label: '中国备案:', type: 'switch', span: 2 },
  { prop: 'fileFee', label: '报关费:', type: 'number', options: { symbol: '', precision: '2' }, span: 5 },
  { prop: 'operateFee', label: '打包费:', type: 'number', options: { symbol: '', precision: '2' }, span: 5 },
  { prop: 'serverFee', label: '贴标费:', type: 'number', options: { symbol: '', precision: '2' }, span: 5 },
  { prop: 'unloadFee', label: '卸货费:', type: 'number', options: { symbol: '', precision: '2' }, span: 5 },
  { prop: 'deliveryFee', label: '送仓费:', type: 'number', options: { symbol: '', precision: '2' }, span: 5 },
  { prop: 'otherFee', label: '其他费:', type: 'number', options: { symbol: '', precision: '2' }, span: 5 },
];
const formRules = {
  volWeiRate: [
    { required: true, message: '请输入体重比', trigger: 'blur' },
    { validator: onlyDigitalValid, trigger: 'blur' },
  ],
  goodsWeight: [
    { required: true, message: '请输入总重量', trigger: 'blur' },
    { validator: onlyFloatNumber, trigger: 'blur' },
  ],
  squareNumber: [
    { required: true, message: '请输入总方数', trigger: 'blur' },
    { validator: onlyFloatNumber, trigger: 'blur' },
  ],
  volumeWeight: [
    { required: true, message: '请输入体积重', trigger: 'blur' },
    { validator: onlyFloatNumber, trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { code: '3-1-3-1', name: 'consignor-cancel-submit' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { code: '3-1-3-2', name: 'consignor-ensure-submit' },
    onClick: async () => {
      const { value: data } = addEditData
      //填充选项数据
      data.parentCode = parentCodeOpts.value?.find(item => item.value === data?.parentId)?.label;
      data.goodTypeName = goodTypeCreOpts.value?.find(item => item.value === data?.goodTypeId)?.label;
      data.auditorName = auditorsOpts.value?.find(item => item.value === data?.auditorId)?.label;
      if (data.orderTime && !((data.orderTime as any) instanceof Number)) {
        data.orderTime = data.orderTime.valueOf()
      }
      data.orderFund = {
        fileFee: data.fileFee,
        operateFee: data.operateFee,
        serverFee: data.serverFee,
        unloadFee: data.unloadFee,
        deliveryFee: data.deliveryFee,
        otherFee: data.otherFee,
        singleDeclare: data.singleDeclare,
      };
      data.cargos = cargoData.value;
      if (data?.id) {
        data.storageManNames = undefined;
        await orderUpdateData(data);
      } else {
        await orderAddData(data!);
      }
      addEditModal.value = false;
      addEditEditing.value = false;
      searchCallback();
    },
  },
];

//生命周函数
onMounted(() => {
  orderStatusOpts.value = normalOrderStatusOpts;
  isHoldOpts.value = normalIsHoldOpts;
  saleCategoryOpts.value = salePropertyOpts;
  transSiteOpts.value = normalTransSiteOpts;
  transWayOpts.value = normalTransWayOpts;
  consignorOpts().then(({ data }) => {
    consignors.value = data || [];
  });
  staffOptsData(roleCategoryOpts[1].value).then(({ data }) => {
    salesmanOpts.value = data || [];
  });
  staffOptsData(roleCategoryOpts[2].value).then(({ data }) => {
    serviceOpts.value = data || [];
  });
  staffOptsData(roleCategoryOpts[5].value).then(({ data }) => {
    auditorsOpts.value = data || [];
  });
  staffOptsData(roleCategoryOpts[4].value).then(({ data }) => {
    storageManOpts.value = data || [];
  });
  valueOptsData({ dictName: dictValueOpts[0].label }).then(({ data }) => {
    channelOpts.value = data || [];
  });
  valueOptsData({ dictName: dictValueOpts[2].label }).then(({ data }) => {
    goodTypeOpts.value = data || [];
  });
  valueOptsData({ dictName: dictValueOpts[4].label }).then(({ data }) => {
    categoryOpts.value = data || [];
  });
  valueOptsData({ dictName: dictValueOpts[3].label, isTree: true }).then(({ data }) => {
    pathwayOpts.value = data || [];
  });
  searchCallback();
});
watch(() => addEditData.value.channelId, (newV) => {
  if (newV) {
    valueOptsData({ isBelongChannel: true, dictId: newV, dictName: dictValueOpts[2].label }).then(({ data }) => {
      goodTypeCreOpts.value = data;
    });
    const channelItem = channelOpts.value?.find(item => item.value === newV);
    if (channelItem) {
      const channelCategories = JSON.parse(channelItem.otherLabel || '[""]');
      addEditData.value.channelName = channelItem?.label;
      addEditData.value.channelCategory = channelCategories[0];
    }
  }
});
watch(() => addEditData.value.consignorId, (newV) => {
  if (newV) {
    consigneeOpts(newV!).then(({ data }) => {
      consignees.value = data || [];
    });
  }
});
watchEffect(() => {
  if (addEditData.value) {
    const { squareNumber, volWeiRate } = addEditData.value;
    addEditData.value.volumeWeight = +(squareNumber! * 1e6 / volWeiRate!).toFixed(2);
  }
});

//货物列表相关
const cargoData = ref<CargoItemType[]>([]);
const cargoColumns: ListColumnType[] = [
  { prop: 'goodsCode', label: '品名(英)', type: "input", maxlength: 16 },
  { prop: 'goodsName', label: '品名(中)', type: "input", maxlength: 16 },
  { prop: 'goodsNumber', label: '数量', type: 'input', maxlength: 16 },
  { prop: 'goodsKits', label: '件数', type: "number", options: { symbol: '', precision: '0' } },
  { prop: 'goodsWeight', label: '重量/KG', type: "number", options: { symbol: '', precision: '2' } },
  { prop: 'goodsLength', label: '长/CM', type: "number", options: { symbol: '', precision: '0' } },
  { prop: 'goodsWidth', label: '宽/CM', type: "number", options: { symbol: '', precision: '0' } },
  { prop: 'goodsHeight', label: '高/CM', type: "number", options: { symbol: '', precision: '0' } },
  { prop: 'goodsVolume', label: '体积/CM³', type: "number", options: { symbol: '', precision: '0' } },
];
const resetSumRowData = (data: any[]) => {
  addEditData.value.goodsWeight = data[5] === 'N/A' ? 0 : data[5];
  addEditData.value.squareNumber = data[9] === 'N/A' ? 0 : +(data[9] / 1e6).toFixed(3);
  addEditData.value.volumeWeight = data[9] === 'N/A' ? 0 : +(data[9] / addEditData!.value!.volWeiRate!).toFixed(2);
  addEditData.value.goodsKits = data[4] === 'N/A' ? 0 : data[4];
  addEditData.value.goodsVolume = data[9] === 'N/A' ? 0 : data[9];
};
const handleCalculate = () => {
  cargoData.value.forEach(item => {
    item.goodsVolume = (item.goodsKits ?? 0) * (item.goodsLength ?? 0) * (item.goodsWidth ?? 0) * (item.goodsHeight ?? 0)
  });
};
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

.title-box {
  display: flex;
  justify-self: start;
  height: auto;
  width: 100%;
}
</style>