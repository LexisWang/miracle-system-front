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

export {
  binaryChoiceOpts,
  normalStatusOpts,
  requestMethodOpts,
};
