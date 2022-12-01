export interface MenuListType {
  id?: number;
  name?: string;
  menuCode?: string;
  menuName?: string;
  menuUrl?: string;
  menuIcon?: string;
  menuStatus?: number;
  sortNo?: number;
  tierLevel?: number;
  globalSort?: number;
  pIdArr?: number[];
  pId?: number;
  pIds?: string;
  menuRemark?: string;
  createTime?: Date | string;
  updateTime?: Date | string;
  creatorId?: number;
  creatorName?: string;
  updaterId?: number;
  updaterName?: string;
  version?: number;
  deleted?: boolean;
}

export interface MenuSearchType {
  size: number;
  current: number;
  menuCode?: string;
  menuName?: string;
  menuStatus?: number[];
  pidCascade?: number[];
  createTimeStart?: number;
  createTimeEnd?: number;
  menuNames?: string;
}
