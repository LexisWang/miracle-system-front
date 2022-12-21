export interface DictListType {
  id?: number;
  dictCode?: string;
  dictName?: string;
  dictStatus?: number;
  dictRemark?: string;
  createTime?: Date | string;
  updateTime?: Date | string;
  creatorId?: number;
  creatorName?: string;
  updaterId?: number;
  updaterName?: string;
  version?: number;
  deleted?: boolean;
}

export interface DictSearchType {
  size: number;
  current: number;
  dictCode?: string;
  dictName?: string;
  createTimeStart?: number;
  createTimeEnd?: number;
  dictNames?: string;
}

export interface ValueListType {
  id?: number;
  name?: string;
  valueCode?: string;
  valueName?: string;
  valueStatus?: number;
  valueRemark?: string;
  includeIds?: string;
  belongName?: string | string[];
  dictId?: number;
  dictName?: string;
  createTime?: Date | string;
  updateTime?: Date | string;
  creatorId?: number;
  creatorName?: string;
  updaterId?: number;
  updaterName?: string;
  version?: number;
  deleted?: boolean;
}

export interface ValueSearchType {
  size: number;
  current: number;
  valueCode?: string;
  valueName?: string;
  dictId?: number;
}

export interface ValueOptsType {
  dictName?: string;
  dictId?: number;
  ids?: number[];
  isTree?: boolean;
  isBelongChannel?: boolean;
}
