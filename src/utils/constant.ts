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
