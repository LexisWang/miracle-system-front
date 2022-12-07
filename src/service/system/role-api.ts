import request from '@/utils/request';
import type { BaseOptType, NormalPageDataType, NormalRespType, TreeOptType } from "@/type/base-type";
import type { RoleListType, RoleSearchType } from "@/type/system/role-type";
import type { TreeKey } from "element-plus/es/components/tree/src/tree.type";

//1.获取角色选项
export function roleOptsData(orgId: number): Promise<NormalRespType<TreeOptType[]>> {
  return request.post(`/system-mgr/sys-role/roleOptsData`, undefined, { params: { orgId } });
}

//2.校验角色数据是否重复
export function checkRoleExist(data: RoleListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/system-mgr/sys-role/checkExist`, data);
}

//3.角色新增
export function roleAddData(data: RoleListType): Promise<NormalRespType<any>> {
  return request.post(`/system-mgr/sys-role/roleAddData`, data);
}

//4.角色删除
export function roleDeleteData(data: number[], remark?: string): Promise<NormalRespType<any>> {
  return request.delete(`/system-mgr/sys-role/roleDeleteData`, { data, params: { remark } });
}

//5.角色修改
export function roleUpdateData(data: RoleListType): Promise<NormalRespType<any>> {
  return request.put(`/system-mgr/sys-role/roleUpdateData`, data );
}

//6.角色列表数据
export function rolePageData(data: RoleSearchType): Promise<NormalRespType<NormalPageDataType<RoleListType>>> {
  return request.post(`/system-mgr/sys-role/rolePageData`, data);
}

//7.导出角色
export function roleExportData(data: RoleSearchType) {
  return request.post(`/system-mgr/sys-role/roleExportData`, data, { responseType: 'blob' });
}

//8.获取角色对应的权限
export function rolePerms(roleId: number): Promise<NormalRespType<BaseOptType[]>> {
  return request.post(`/system-mgr/sys-role/rolePerms/${roleId}`);
}

//9.获取角色对应的菜单
export function roleMenus(roleId: number): Promise<NormalRespType<BaseOptType[]>> {
  return request.post(`/system-mgr/sys-role/roleMenus/${roleId}`);
}

//10.获取角色对应的权限
export function roleButtons(roleId: number): Promise<NormalRespType<BaseOptType[]>> {
  return request.post(`/system-mgr/sys-role/roleButtons/${roleId}`);
}

//11.更新角色对应的权限
export function roleUpdatePerms(roleId: number, data: { roleId: number, permId: TreeKey }[]): Promise<NormalRespType<BaseOptType[]>> {
  return request.put(`/system-mgr/sys-role/rolePerms/${roleId}`, data);
}

//12.更新角色对应的菜单
export function roleUpdateMenus(roleId: number, data: { roleId: number, menuId: TreeKey }[]): Promise<NormalRespType<BaseOptType[]>> {
  return request.put(`/system-mgr/sys-role/roleMenus/${roleId}`, data);
}

//13.更新角色对应的按钮
export function roleUpdateButtons(roleId: number, data: { roleId: number, buttonId: TreeKey }[]): Promise<NormalRespType<BaseOptType[]>> {
  return request.put(`/system-mgr/sys-role/roleButtons/${roleId}`, data);
}
