import type { ElPermissionType, TagDataType } from "@/type/base-type";

export interface LoginFormModel {
  username: string;
  password: string;
  nextPath?: string;
}

export interface BackendRoute {
  name: string;
  children?: BackendRoute[];
}

export interface LoginResDto {
  nickname?: string;
  roleMenus?: BackendRoute[];
  roleButtons?: ElPermissionType[];
  jwtToken?: string;
}

export interface BreadMenu {
  path?: string;
  title?: string;
  name?: string;
}

export interface GlobalDataType {
  loginData: LoginResDto;
  nextPath?: string;

  isCollapse: boolean;
  currentMenu?: BreadMenu[];
  currentFullPath?: string;
  layoutTabList: TagDataType[];
  tabMaxCount: number;
}
