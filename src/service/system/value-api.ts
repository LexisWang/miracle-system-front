import request from '@/utils/request';
import type { NormalPageDataType, NormalRespType, TreeOptType } from "@/type/base-type";
import type { ValueListType, ValueOptsType, ValueSearchType } from "@/type/system/dict-type";

//1.获取配置值选项
export function valueOptsData(data: ValueOptsType): Promise<NormalRespType<TreeOptType[]>> {
  return request.post(`/system-mgr/bim-value/valueOptsData`, data);
}

//2.校验配置值数据是否重复
export function checkValueExist(data: ValueListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/system-mgr/bim-value/checkExist`, data);
}

//3.配置值新增
export function valueAddData(data: ValueListType): Promise<NormalRespType<any>> {
  return request.post(`/system-mgr/bim-value/valueAddData`, data);
}

//4.配置值删除
export function valueDeleteData(data: number[], remark?: string): Promise<NormalRespType<any>> {
  return request.delete(`/system-mgr/bim-value/valueDeleteData`, { data, params: { remark } });
}

//5.配置值修改
export function valueUpdateData(data: ValueListType): Promise<NormalRespType<any>> {
  return request.put(`/system-mgr/bim-value/valueUpdateData`, data );
}

//6.配置值列表数据
export function valuePageData(data: ValueSearchType): Promise<NormalRespType<NormalPageDataType<ValueListType>>> {
  return request.post(`/system-mgr/bim-value/valuePageData`, data);
}

//7.导出配置值
export function valueExportData(data: ValueSearchType) {
  return request.post(`/system-mgr/bim-value/valueExportData`, data, { responseType: 'blob' });
}
