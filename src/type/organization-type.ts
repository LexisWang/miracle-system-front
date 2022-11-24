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
  pIds?: string;
  createTime?: Date | string;
  updateTime?: Date | string;
  creatorId?: number;
  creatorName?: string;
  updaterId?: number;
  updaterName?: string;
  version?: number;
  deleted?: boolean;
}

export interface OrgPageDataType {
  total: number;
  pages: number;
  records: OrgListType[];
}

export interface OrgSearchType {
  size: number
  current: number;
  orgName?: string;
  orgCode?: string;
  orgStatus?: number;
  isLeaf?: number;
  scopeKey?: number[];
  address?: number;
  createTime?: string;
  orgCodes?: string;
}
