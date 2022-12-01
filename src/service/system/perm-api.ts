import request from '@/utils/request';
import type { NormalPageDataType, NormalRespType, TreeOptType } from "@/type/base-type";
import type { PermListType, PermSearchType } from "@/type/system/perm-type";

//1.获取父级权限选项
export function permOptsData(): Promise<NormalRespType<TreeOptType[]>> {
  return request.post(`/system-mgr/sys-perm/permOptsData`);
}

//2.校验权限数据是否重复
export function checkPermExist(data: PermListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/system-mgr/sys-perm/checkExist`, data);
}

//3.权限新增
export function permAddData(data: PermListType): Promise<NormalRespType<any>> {
  return request.post(`/system-mgr/sys-perm/permAddData`, data);
}

//4.权限删除
export function permDeleteData(data: number[], remark?: string): Promise<NormalRespType<any>> {
  return request.delete(`/system-mgr/sys-perm/permDeleteData`, { data, params: { remark } });
}

//5.权限修改
export function permUpdateData(data: PermListType): Promise<NormalRespType<any>> {
  return request.put(`/system-mgr/sys-perm/permUpdateData`, data );
}

//6.权限列表数据
export function permPageData(data: PermSearchType): Promise<NormalRespType<NormalPageDataType<PermListType>>> {
  return request.post(`/system-mgr/sys-perm/permPageData`, data);
}

//7.导出权限
export function permExportData(data: PermSearchType) {
  return request.post(`/system-mgr/sys-perm/permExportData`, data, { responseType: 'blob' });
}
