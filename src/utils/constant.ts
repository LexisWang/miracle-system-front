import moment from "moment/moment";

export const WS_ADDRESS = 'ws://localhost:3000/ws/'

export const binaryChoiceOpts = [
  { value: 0, label: '否', color: 'red' },
  { value: 1, label: '是', color: 'green' },
];

export const normalStatusOpts = [
  { value: -1, label: '默认' },
  { value: 0, label: '禁用', color: 'red' },
  { value: 1, label: '启用', color: 'green' },
];

export const requestMethodOpts = [
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'GET', label: 'GET' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'OPTIONS', label: 'OPTIONS' },
];

export const roleCategoryOpts = [
  { value: 1, label: '开发' },
  { value: 5, label: '业务' },
  { value: 10, label: '关务' },
  { value: 15, label: '操作' },
  { value: 20, label: '仓务' },
  { value: 25, label: '质检' },
  { value: 30, label: '财务' },
];

export const dictValueOpts = [
  { value: 1, label: '服务渠道' },
  { value: 2, label: '货运代理' },
  { value: 3, label: '货物类型' },
  { value: 4, label: '获客途径' },
  { value: 5, label: '客户性质' },
  { value: 6, label: '付款类型' },
  { value: 7, label: '客户级别' },
];

export const creditStatusOpts = [
  { value: 10, label: '危险级', color: 'red' },
  { value: 20, label: '注意级', color: 'orange' },
  { value: 30, label: '优质级', color: 'green' },
];

//图片类型或者PDF类型附件
export const CAN_PREVIEW_FILE_TYPE = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf', 'image/gif', 'image/bpm', 'image/dpg', 'image/webp'];

export const normalOrderStatusOpts = [
  { value: 0, label: '预定中', color: 'indigo' },
  { value: 1, label: '已入库', color: 'orange' },
  { value: 2, label: '运输中', color: 'yellow' },
  { value: 7, label: '清关中', color: 'yellowgreen' },
  { value: 8, label: '清关完成', color: 'cyan' },
  { value: 41, label: '运输完成', color: '#00695C' },
  { value: 9, label: '到分派中心', color: '#00695C' },
  { value: 10, label: '开始派送', color: '#08dec3' },
  { value: 70, label: '部分派送', color: '#13a1b3' },
  { value: 3, label: '已签收', color: 'blue' },
  { value: 4, label: '已完成', color: 'green' },
  { value: 5, label: '已终止', color: 'purple' },
  { value: 6, label: '异常', color: 'red' },
];

export const normalIsHoldOpts = [
  { value: -1, label: '待确认', color: 'yellow' },
  { value: 0, label: '不HOLD', color: 'green' },
  { value: 1, label: 'HOLD', color: 'red' },
];

export const salePropertyOpts = [
  { value: -1, label: '默认' },
  { value: 0, label: '外配' },
  { value: 1, label: '自营' },
];

export const normalTransSiteOpts = [
  { value: '义乌', label: '义乌' },
  { value: '广州', label: '广州' },
  { value: '深圳', label: '深圳' },
  { value: '其他', label: '其他' },
];

export const normalTransWayOpts = [
  { value: '空运', label: '空运' },
  { value: '海运', label: '海运' },
];

export const datetimeRangeShortcuts = [
  {
    text: '今天',
    value: () => {
      const start = moment().startOf('day').valueOf();
      const end = moment().endOf('day').valueOf();
      return [new Date(start), new Date(end)];
    },
  },
  {
    text: '本周',
    value: () => {
      const start = moment().subtract(7, 'days').startOf('day').valueOf();
      const end = moment().endOf('day').valueOf();
      return [new Date(start), new Date(end)];
    },
  },
  {
    text: '近一月',
    value: () => {
      const start = moment().subtract(1, 'months').startOf('day').valueOf();
      const end = moment().endOf('day').valueOf();
      return [new Date(start), new Date(end)];
    },
  },
  {
    text: '上整月',
    value: () => {
      const start = moment().subtract(1, 'months').startOf('month').valueOf();
      const end = moment().subtract(1, 'months').endOf('month').valueOf();
      return [new Date(start), new Date(end)];
    },
  },
  {
    text: '本月',
    value: () => {
      const start = moment().startOf('month').valueOf();
      const end = moment().endOf('day').valueOf();
      return [new Date(start), new Date(end)];
    },
  },
]
