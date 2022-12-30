export interface PermListType {
  id?: number;
  name?: string;
  permCode?: string;
  permName?: string;
  permUri?: string;
  permStatus?: number;
  sortNo?: number;
  tierLevel?: number;
  globalSort?: number;
  pId?: number;
  pIds?: number[];
  permRemark?: string;
  createTime?: Date | string;
  updateTime?: Date | string;
  creatorId?: number;
  creatorName?: string;
  updaterId?: number;
  updaterName?: string;
  version?: number;
  deleted?: boolean;
}

export interface PermSearchType {
  size: number;
  current: number;
  permCode?: string;
  permName?: string;
  permStatus?: number[];
  pidCascade?: number[];
  createTimeStart?: number;
  createTimeEnd?: number;
  permNames?: string;
}
