export interface ButtonListType {
  id?: number;
  code?: string;
  name?: string;
  menuId?: number;
  menuIds?: number[];
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
