import request from '@/utils/request';
import type { BaseOptType, NormalPageDataType, NormalRespType } from "@/type/base-type";
import type { StaffListType, StaffSearchType } from "@/type/system/staff-type";
import type { LoginFormModel, LoginResDto } from "@/type/layout-type";
import type { AxiosResponse } from "axios";

//1.获取职员选项
export function staffOptsData(roleCategory: number): Promise<NormalRespType<BaseOptType[]>> {
  return request.post(`/system-mgr/sys-staff/staffOptsData`, undefined, { params: { roleCategory } });
}

//2.校验职员数据是否重复
export function checkStaffExist(data: StaffListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/system-mgr/sys-staff/checkExist`, data);
}

//3.职员新增
export function staffAddData(data: StaffListType): Promise<NormalRespType<any>> {
  return request.post(`/system-mgr/sys-staff/staffAddData`, data);
}

//4.职员删除
export function staffDeleteData(data: number[], remark?: string): Promise<NormalRespType<any>> {
  return request.delete(`/system-mgr/sys-staff/staffDeleteData`, { data, params: { remark } });
}

//5.职员修改
export function staffUpdateData(data: StaffListType): Promise<NormalRespType<any>> {
  return request.put(`/system-mgr/sys-staff/staffUpdateData`, data );
}

//6.职员列表数据
export function staffPageData(data: StaffSearchType): Promise<NormalRespType<NormalPageDataType<StaffListType>>> {
  return request.post(`/system-mgr/sys-staff/staffPageData`, data);
}

//7.导出职员
export function staffExportData(data: StaffSearchType) {
  return request.post(`/system-mgr/sys-staff/staffExportData`, data, { responseType: 'blob' });
}

//8.用户登录
export function staffLoginApi(data: LoginFormModel): Promise<AxiosResponse<LoginResDto>> {
  return request.post(`/system-mgr/sys-staff/staffLogin`, data);
}

//9.可选择的领导
export function staffSuperData(): Promise<NormalRespType<BaseOptType[]>> {
  return request.post(`/system-mgr/sys-staff/staffSuperData`);
}

//10.可选择的组员
export function staffCrewsData(): Promise<NormalRespType<BaseOptType[]>> {
  return request.post(`/system-mgr/sys-staff/staffCrewsData`);
}

//11.修改密码
export function staffUpdatePwd(data: { id: number; newPwd: string}): Promise<NormalRespType<any>> {
  return request.put(`/system-mgr/sys-staff/staffUpdatePwd`, data);
}

//12.重置密码
export function staffResetPwd(data: { id: number }): Promise<NormalRespType<any>> {
  return request.post(`/system-mgr/sys-staff/staffResetPwd`, data);
}

//13.重置登录职员的token缓存信息
export function staffResetRedisLoginTime(data: { id: number }): Promise<NormalRespType<any>> {
  return request.post(`/system-mgr/sys-staff/staffResetRedisLoginTime`, data);
}
