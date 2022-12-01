import request from '@/utils/request';
import type { NormalPageDataType, NormalRespType, TreeOptType } from "@/type/base-type";
import type { MenuListType, MenuSearchType } from "@/type/system/menu-type";

//1.获取父级菜单选项
export function menuOptsData(): Promise<NormalRespType<TreeOptType[]>> {
  return request.post(`/system-mgr/sys-menu/menuOptsData`);
}

//2.校验菜单数据是否重复
export function checkPermExist(data: MenuListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/system-mgr/sys-menu/checkExist`, data);
}

//3.菜单新增
export function menuAddData(data: MenuListType): Promise<NormalRespType<any>> {
  return request.post(`/system-mgr/sys-menu/menuAddData`, data);
}

//4.菜单删除
export function menuDeleteData(data: number[], remark?: string): Promise<NormalRespType<any>> {
  return request.delete(`/system-mgr/sys-menu/menuDeleteData`, { data, params: { remark } });
}

//5.菜单修改
export function menuUpdateData(data: MenuListType): Promise<NormalRespType<any>> {
  return request.put(`/system-mgr/sys-menu/menuUpdateData`, data );
}

//6.菜单列表数据
export function menuPageData(data: MenuSearchType): Promise<NormalRespType<NormalPageDataType<MenuListType>>> {
  return request.post(`/system-mgr/sys-menu/menuPageData`, data);
}

//7.导出菜单
export function menuExportData(data: MenuSearchType) {
  return request.post(`/system-mgr/sys-menu/menuExportData`, data, { responseType: 'blob' });
}
