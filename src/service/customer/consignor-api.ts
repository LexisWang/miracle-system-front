import request from '@/utils/request';
import type { BaseOptType, NormalPageDataType, NormalRespType } from "@/type/base-type";
import type { ConsignorListType, ConsignorSearchType } from "@/type/customer/consignor-type";

//1.获取发货人选项
export function consignorOpts(): Promise<NormalRespType<BaseOptType[]>> {
  return request.post(`/customer-mgr/cms-consignor/consignorOpts`);
}

//2.校验发货人数据是否重复
export function checkConsignorExist(data: ConsignorListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/customer-mgr/cms-consignor/checkExist`, data);
}

//3.发货人新增
export function consignorAddData(data: ConsignorListType): Promise<NormalRespType<any>> {
  return request.post(`/customer-mgr/cms-consignor/consignorAddData`, data);
}

//4.发货人删除
export function consignorDeleteData(data: number[], remark?: string): Promise<NormalRespType<any>> {
  return request.delete(`/customer-mgr/cms-consignor/consignorDeleteData`, { data, params: { remark } });
}

//5.发货人修改
export function consignorUpdateData(data: ConsignorListType): Promise<NormalRespType<any>> {
  return request.put(`/customer-mgr/cms-consignor/consignorUpdateData`, data );
}

//6.发货人列表数据
export function consignorPageData(data: ConsignorSearchType): Promise<NormalRespType<NormalPageDataType<ConsignorListType>>> {
  return request.post(`/customer-mgr/cms-consignor/consignorPageData`, data);
}

//7.导出发货人
export function consignorExportData(data: ConsignorSearchType) {
  return request.post(`/customer-mgr/cms-consignor/consignorExportData`, data, { responseType: 'blob' });
}
