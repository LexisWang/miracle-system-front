import request from '@/utils/request';
import type { NormalPageDataType, NormalRespType } from "@/type/base-type";
import type { ButtonListType, ButtonSearchType } from "@/type/system/button-type";
import type { TreeOptType } from "@/type/base-type";

//1.获取按钮选项
export function buttonOptsData(): Promise<NormalRespType<TreeOptType[]>> {
  return request.post(`/system-mgr/sys-button/buttonOptsData`);
}

//2.校验按钮数据是否重复
export function checkButtonExist(data: ButtonListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/system-mgr/sys-button/checkExist`, data);
}

//2.新增按钮数据
export function buttonAddData(data: ButtonListType): Promise<NormalRespType<any>> {
  return request.post(`/system-mgr/sys-button/buttonAddData`, data);
}

//3.删除按钮数据
export function buttonDeleteData(data: number[]): Promise<NormalRespType<any>> {
  return request.delete(`/system-mgr/sys-menu/buttonDeleteData`, { data });
}

//3.单个更新按钮数据
export function buttonUpdateData(data: ButtonListType): Promise<NormalRespType<any>> {
  return request.put(`/system-mgr/sys-button/buttonUpdateData`, data );
}

//4.按钮列表数据
export function buttonPageData(data: ButtonSearchType): Promise<NormalRespType<NormalPageDataType<ButtonListType>>> {
  return request.post(`/system-mgr/sys-button/buttonPageData`, data);
}
