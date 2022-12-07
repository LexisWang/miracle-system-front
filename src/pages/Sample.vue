<template>
  <div class="page">
    <div class="page-header">
      <miracle-search
        :search-column="searchColumns"
        :search-data="searchData"
        :other-operates="otherOperates"
        :select-opts="{
            orgStatus: statusOpts,
            isLeaf: isLeafOpts,
          }"
        :cascade-opts="{
            scopeKey: cascadeScopeKey,
           }"
        :suggest-opts="{
            address: suggestAddress,
          }"
        @search-callback="searchCallback"
        @reset-callback="resetCallback"
        @create-callback="handleAdd"
      />
    </div>
    <miracle-table
      class="page-main"
      ref="tableInstance"
      :table-loading="tableLoading"
      :table-columns="tableColumns"
      :list-data="records"
      :operate-menus="operateMenus"
      :select-opts="{
          orgStatus: statusOpts,
          isLeaf: isLeafOpts,
        }"
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
      <!--<template #default="{data: {name, age}}">
            姓名:{{ name }}&#45;&#45;年龄:{{ age }}
          </template>-->
    </miracle-table>
    <miracle-modal
      :modal-add-edit="addEditModal"
      :add-edit-data="addEditData"
      :display-data="displayData"
      :form-rules="formRules"
      :cascade-opts="{
            scopeKey: cascadeScopeKey,
           }"
      :suggest-opts="{
            address: suggestAddress,
          }"
      :radio-opts="{
            orgStatus: statusOpts,
            isLeaf: isLeafOpts,
          }"
      :footer-button="footerButton"
      :editing="addEditEditing"
    />
  </div>
</template>

<script setup lang="ts">
//a.公共引入
import { onMounted, reactive, ref, toRefs } from 'vue';
import { CaretRight, DeleteFilled, Edit, Expand, Switch, View } from '@element-plus/icons-vue';
//b.自定义类型引入
import type {
  AddEditButtonType,
  CascadeItemType,
  ListColumnType,
  NormalPageDataType,
  OperateMenuType,
  BaseOptType,
  SearchColumnType,
  SuggestItemType
} from "@/type/base-type";
import type { OrgListType, OrgSearchType } from "@/type/system/org-type";
//c.自定义工具引入
import { dateToString, valueToLabel } from '@/utils/transform';
import { binaryChoiceOpts, normalStatusOpts } from '@/utils/constant';
//d.其他组件引入
import MiracleTable from '@/pages/components/MiracleTable.vue';
import MiracleSearch from '@/pages/components/MiracleSearch.vue';
import MiracleModal from '@/pages/components/MiracleModal.vue';
//e.接口引入
import { orgListApi } from "@/service/system-api";
import { orgDeleteData } from "@/service/system/org-api";

//1.1.各可筛选项数据
const statusOpts = ref<BaseOptType[]>();
const isLeafOpts = ref<BaseOptType[]>();
const suggestAddress = ref<SuggestItemType[]>();
const cascadeScopeKey = ref<CascadeItemType[]>();
//1.2.本组件数据绑定
//1.2.1.dom元素绑定
const tableInstance = ref<InstanceType<typeof MiracleTable>>();
//1.2.2.搜索数据绑定
const searchData = ref<OrgSearchType>({ current: 1, size: 15 });
//1.2.3.表格数据绑定
const tableData = reactive<NormalPageDataType<OrgListType>>({ records: [], total: 0, pages: 0 })
//1.2.4.加载状态相关
const tableLoading = ref(false);
//1.3.1.新增和编辑
const addEditEditing = ref(false);
const addEditModal = ref(false);
const addEditData = ref<OrgListType>();
const displayData: SearchColumnType[] = [
  { prop: 'orgCode', label: '代码:', type: 'input' },
  { prop: 'orgName', label: '名称:', type: 'textArea' },
  {
    prop: 'sortNo',
    label: '排序号',
    type: 'number',
    options: { symbol: '', precision: '0' },
  },
  { prop: 'isLeaf', label: '是否叶子:', type: 'radio' },
  { prop: 'orgStatus', label: '状态:', type: 'radio' },
];
const formRules = {
  name: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  desc: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
};
const footerButton: AddEditButtonType[] = [
  {
    permission: { name: '', code: '' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
    },
  },
  {
    permission: { name: '', code: '' },
    onClick: () => {
      addEditModal.value = false;
      addEditEditing.value = false;
      console.log(addEditData);
    },
  },
];

//2.各按钮处理函数
//2.1.搜索图标回调
//5.加载状态修改
const setTableLoading = (v: boolean) => tableLoading.value = v;
const searchCallback = () => {
  //2.1.1.设置加载状态为 `true`
  setTableLoading(true);
  //2.1.2.调用接口获取列表数据
  orgListApi(searchData.value).then(({ data }) => {
    records.value = data.records;
    total.value = data.total;
    //2.1.3.设置加载状态为 `false`
    setTableLoading(false);
  }).catch(() => setTableLoading(false));
};
//2.2.清空图标回调
const resetCallback = () => {
  searchData.value = { current: 1, size: 15 };
  // searchCallback();
  orgDeleteData([1000, 2000], '嘿嘿哈哈!');
};
//新增按钮处理
const handleAdd = () => {
  addEditModal.value = true;
  addEditEditing.value = true;
  addEditData.value = {
    orgStatus: 1,
  };
};
//2.3.导出处理函数
const exportData = (params: any) => {
  console.log('handleExportParams', params);
};
//3.4.导出详细处理函数
const exportDetailData = (params: any) => {
  console.log('handleExportDetailParams', params);
};

//3.各组件部分属性配置
//3.1.搜索栏配置
//3.1.1.搜索表单配置
const searchColumns: SearchColumnType[] = [
  { type: 'input', prop: 'orgCode', placeholder: '代码' },
  { type: 'input', prop: 'orgName', placeholder: '名称' },
  { type: 'select', prop: 'orgStatus', placeholder: '状态' },
  { type: 'select', prop: 'isLeaf', placeholder: '是否叶子' },
  { type: 'cascade', prop: 'scopeKey', placeholder: '权限码' },
  { type: 'autocomplete', prop: 'address', placeholder: '地址' },
  { type: 'input', prop: 'orgCode', placeholder: '代码' },
  {
    type: 'date-picker',
    prop: 'createTime',
    placeholder: '',
    startTimeStr: '新建时间(起始)',
    endTimeStr: '新建时间(结束)'
  },
  { type: 'input', prop: 'orgCodes', placeholder: '代码(多个)', span: 18 },
  { type: 'button', prop: 'operate', placeholder: '', addPermission: { name: '1111' } },
];
//3.1.2.搜索栏按钮配置
const otherOperates: OperateMenuType[] = [
  {
    name: '导出',
    key: 'export',
    icon: CaretRight,
    callback: exportData,
    permission: { name: 'export-order', code: '' },
  },
  {
    icon: Expand,
    name: '导出(订单)',
    key: 'export-detail',
    callback: exportDetailData,
    permission: { name: 'export-order-detail', code: '' },
  },
];

//3.2.表格配置
//3.2.1.列表的表头
const tableColumns: ListColumnType[] = [
  { prop: 'orgCode', label: '代码', fixed: 'left', width: 140 },
  { prop: 'orgName', label: '名称', fixed: 'left', width: 140 },
  { prop: 'orgStatus', label: '状态', enumTrans: valueToLabel },
  { prop: 'isLeaf', label: '是否叶子', enumTrans: valueToLabel },
  { prop: 'sortNo', label: '排序号' },
  { prop: 'scopeKey', label: '权限码' },
  { prop: 'tierLevel', label: '数据等级' },
  { prop: 'createTime', label: '新建时间', type: 'date', formatter: dateToString, width: 100 },
  { prop: 'updateTime', label: '修改时间', type: 'date', formatter: dateToString, width: 100 },
];
//3.2.2.操作按钮
const operateMenus: OperateMenuType[] = [
  {
    name: '详情',
    icon: View,
    key: 'detail',
    callback: (row: OrgListType) => {
      row.name = row.orgName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = false;
    },
  },
  {
    name: '修改',
    icon: Edit,
    key: 'edit',
    callback: (row: OrgListType) => {
      row.name = row.orgName;
      addEditData.value = row;
      addEditModal.value = true;
      addEditEditing.value = true;
    },
  },
  {
    name: '启/禁用',
    icon: Switch,
    key: 'switchEffect',
  },
  {
    name: '删除',
    icon: DeleteFilled,
    key: 'delete',
  },
];

//4.组件数据解构为响应式单个数据
const { records, total } = { ...toRefs(tableData) };

//5.生命周期函数
//5.1挂载完毕获取数据
onMounted(() => {
  cascadeScopeKey.value = [
    {
      value: 'guide',
      label: 'Guide',
      children: [
        {
          value: 'disciplines',
          label: 'Disciplines',
          children: [
            {
              value: 'consistency',
              label: 'Consistency',
            },
            {
              value: 'feedback',
              label: 'Feedback',
            },
            {
              value: 'efficiency',
              label: 'Efficiency',
            },
            {
              value: 'controllability',
              label: 'Controllability',
            },
          ],
        },
        {
          value: 'navigation',
          label: 'Navigation',
          children: [
            {
              value: 'side nav',
              label: 'Side Navigation',
            },
            {
              value: 'top nav',
              label: 'Top Navigation',
            },
          ],
        },
      ],
    },
    {
      value: 'component',
      label: 'Component',
      children: [
        {
          value: 'basic',
          label: 'Basic',
          children: [
            {
              value: 'layout',
              label: 'Layout',
            },
            {
              value: 'color',
              label: 'Color',
            },
            {
              value: 'typography',
              label: 'Typography',
            },
            {
              value: 'icon',
              label: 'Icon',
            },
            {
              value: 'button',
              label: 'Button',
            },
          ],
        },
        {
          value: 'form',
          label: 'Form',
          children: [
            {
              value: 'radio',
              label: 'Radio',
            },
            {
              value: 'checkbox',
              label: 'Checkbox',
            },
            {
              value: 'input',
              label: 'Input',
            },
            {
              value: 'input-number',
              label: 'InputNumber',
            },
            {
              value: 'select',
              label: 'Select',
            },
            {
              value: 'cascader',
              label: 'Cascader',
            },
            {
              value: 'switch',
              label: 'Switch',
            },
            {
              value: 'slider',
              label: 'Slider',
            },
            {
              value: 'time-picker',
              label: 'TimePicker',
            },
            {
              value: 'date-picker',
              label: 'DatePicker',
            },
            {
              value: 'datetime-picker',
              label: 'DateTimePicker',
            },
            {
              value: 'upload',
              label: 'Upload',
            },
            {
              value: 'rate',
              label: 'Rate',
            },
            {
              value: 'form',
              label: 'Form',
            },
          ],
        },
        {
          value: 'data',
          label: 'Data',
          children: [
            {
              value: 'table',
              label: 'Table',
            },
            {
              value: 'tab',
              label: 'Tag',
            },
            {
              value: 'progress',
              label: 'Progress',
            },
            {
              value: 'tree',
              label: 'Tree',
            },
            {
              value: 'pagination',
              label: 'Pagination',
            },
            {
              value: 'badge',
              label: 'Badge',
            },
          ],
        },
        {
          value: 'notice',
          label: 'Notice',
          children: [
            {
              value: 'alert',
              label: 'Alert',
            },
            {
              value: 'loading',
              label: 'Loading',
            },
            {
              value: 'message',
              label: 'Message',
            },
            {
              value: 'message-box',
              label: 'MessageBox',
            },
            {
              value: 'notification',
              label: 'Notification',
            },
          ],
        },
        {
          value: 'navigation',
          label: 'Navigation',
          children: [
            {
              value: 'menu',
              label: 'Menu',
            },
            {
              value: 'tabs',
              label: 'Tabs',
            },
            {
              value: 'breadcrumb',
              label: 'Breadcrumb',
            },
            {
              value: 'dropdown',
              label: 'Dropdown',
            },
            {
              value: 'steps',
              label: 'Steps',
            },
          ],
        },
        {
          value: 'others',
          label: 'Others',
          children: [
            {
              value: 'dialog',
              label: 'Dialog',
            },
            {
              value: 'tooltip',
              label: 'Tooltip',
            },
            {
              value: 'popover',
              label: 'Popover',
            },
            {
              value: 'card',
              label: 'Card',
            },
            {
              value: 'carousel',
              label: 'Carousel',
            },
            {
              value: 'collapse',
              label: 'Collapse',
            },
          ],
        },
      ],
    },
    {
      value: 'resource',
      label: 'Resource',
      children: [
        {
          value: 'axure',
          label: 'Axure Components',
        },
        {
          value: 'sketch',
          label: 'Sketch Templates',
        },
        {
          value: 'docs',
          label: 'Design Documentation',
        },
      ],
    },
  ];
  suggestAddress.value = [
    { value: 'vue', code: 1 },
    { value: 'element', code: 2 },
    { value: 'cooking', code: 3 },
    { value: 'mint-ui', code: 4 },
    { value: 'vuex', code: 5 },
    { value: 'vue-router', code: 6 },
    { value: 'babel', code: 7 },
    { value: 'vue2', code: 8 },
    { value: 'element2', code: 9 },
    { value: 'cooking2', code: 10 },
    { value: 'mint-ui2', code: 11 },
    { value: 'vuex2', code: 12 },
    { value: 'vue-router2', code: 13 },
    { value: 'babel2', code: 14 },
  ];
  statusOpts.value = normalStatusOpts;
  isLeafOpts.value = binaryChoiceOpts;
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