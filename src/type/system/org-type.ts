export interface OrgListType {
  id?: number;
  name?: string;
  orgCode?: string;
  orgName?: string;
  orgDesc?: string;
  address?: string;
  contact?: string;
  email?: string;
  orgStatus?: number;
  isLeaf?: number;
  sortNo?: number;
  scopeKey?: string;
  tierLevel?: number;
  pId?: number;
  pIds?: number[];
  createTime?: Date | string;
  updateTime?: Date | string;
  creatorId?: number;
  creatorName?: string;
  updaterId?: number;
  updaterName?: string;
  version?: number;
  deleted?: boolean;
}

export interface OrgSearchType {
  size: number;
  current: number;
  orgName?: string;
  orgCode?: string;
  orgStatus?: number[];
  pid?: number[];
  createTimeStart?: number;
  createTimeEnd?: number;
  orgNames?: string;
}
