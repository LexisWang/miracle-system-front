import request from '@/utils/request';
import type { NormalRespType } from "@/type/base-type";
import type { OrgListType, OrgOptsType, OrgPageDataType, OrgSearchType } from "@/type/system/org-type";

//1.获取父级部门组织选项
export function orgOptsData(): Promise<NormalRespType<OrgOptsType[]>> {
  return request.post(`/system-mgr/sys-org/orgOptsData`);
}

//2.校验部门组织数据是否重复
export function checkOrgExist(data: OrgListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/system-mgr/sys-org/checkExist`, data);
}

//3.部门组织新增
export function orgAddData(data: OrgListType): Promise<NormalRespType<any>> {
  return request.post(`/system-mgr/sys-org/orgAddData`, data);
}

//4.部门组织删除
export function orgDeleteData(data: number[], remark?: string): Promise<NormalRespType<any>> {
  return request.delete(`/system-mgr/sys-org/orgDeleteData`, { data, params: { remark } });
}

//5.部门组织修改
export function orgUpdateData(data: OrgListType): Promise<NormalRespType<any>> {
  return request.put(`/system-mgr/sys-org/orgUpdateData`, data );
}

//6.部门组织列表数据
export function orgPageData(data: OrgSearchType): Promise<NormalRespType<OrgPageDataType>> {
  return request.post(`/system-mgr/sys-org/orgPageData`, data);
}

//7.导出部门组织
export function orgDataExport(data: OrgSearchType) {
  return request.post(`/system-mgr/sys-org/orgDataExport`, data);
}
