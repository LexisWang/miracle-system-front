export interface ButtonListType {
  id?: number;
  code?: string;
  name?: string;
  menuIdArr?: number[];
  menuId?: number;
  menuIds?: string;
  sortNo?: number;
}

export interface ButtonSearchType {
  size: number;
  current: number;
  code?: string;
  name?: string;
  menuId?: number[];
  sortNo?: number;
  names?: string;
}
