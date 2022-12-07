export interface RoleListType {
  id?: number;
  name?: string;
  roleCategory?: string;
  roleCode?: string;
  roleName?: string;
  roleDesc?: string;
  roleStatus?: number;
  isLeaf?: number;
  sortNo?: number;
  scopeKey?: string;
  orgIdArr?: number[];
  orgId?: number;
  orgIds?: string;
  orgName?: string;
  roleRemark?: string;
  createTime?: Date | string;
  updateTime?: Date | string;
  creatorId?: number;
  creatorName?: string;
  updaterId?: number;
  updaterName?: string;
  version?: number;
  deleted?: boolean;
}

export interface RoleSearchType {
  size: number;
  current: number;
  roleCode?: string;
  roleName?: string;
  roleStatus?: number[];
  orgIdCascade?: number[];
  createTimeStart?: number;
  createTimeEnd?: number;
  roleNames?: string;
}
