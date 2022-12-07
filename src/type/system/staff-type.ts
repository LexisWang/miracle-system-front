export interface StaffListType {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  nickname?: string;
  email?: string;
  remark?: string;
  staffStatus?: number;
  inviteCode?: string;
  mobile?: string;
  superId?: number;
  superName?: string;
  orgIdArr?: number[];
  orgId?: number;
  orgIds?: string;
  orgName?: string;
  roleId?: number;
  roleName?: string;
  scopeKey?: string;
  sortNo?: number;
  createTime?: Date | string;
  updateTime?: Date | string;
  creatorId?: number;
  creatorName?: string;
  updaterId?: number;
  updaterName?: string;
  version?: number;
  deleted?: boolean;
}

export interface StaffSearchType {
  size: number;
  current: number;
  username?: string;
  nickname?: string;
  roleId?: number;
  staffStatus?: number[];
  orgIdCascade?: number[];
  createTimeStart?: number;
  createTimeEnd?: number;
  nicknames?: string;
}
