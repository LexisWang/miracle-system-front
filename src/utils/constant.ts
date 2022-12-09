const WS_ADDRESS = 'ws://localhost:3000/ws/'

const binaryChoiceOpts = [
  { value: 0, label: '否', color: 'red' },
  { value: 1, label: '是', color: 'green' },
];

const normalStatusOpts = [
  { value: -1, label: '默认' },
  { value: 0, label: '禁用', color: 'red' },
  { value: 1, label: '启用', color: 'green' },
];

const requestMethodOpts = [
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'GET', label: 'GET' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'OPTIONS', label: 'OPTIONS' },
];

const roleCategoryOpts = [
  { value: 1, label: '开发' },
  { value: 5, label: '业务' },
  { value: 10, label: '关务' },
  { value: 15, label: '操作' },
  { value: 20, label: '仓务' },
  { value: 25, label: '质检' },
  { value: 30, label: '财务' },
];

export {
  WS_ADDRESS,
  binaryChoiceOpts,
  normalStatusOpts,
  requestMethodOpts,
  roleCategoryOpts,
};
