import request from '@/utils/request';
import type { BaseOptType, NormalPageDataType, NormalRespType } from "@/type/base-type";
import type { ConsigneeListType, ConsigneeSearchType } from "@/type/customer/consignee-type";

//1.获取收货人选项
export function consigneeOpts(consignorId: number): Promise<NormalRespType<BaseOptType[]>> {
  return request.post(`/customer-mgr/cms-consignee/consigneeOpts`, undefined, { params: { consignorId } });
}

//2.校验收货人数据是否重复
export function checkConsigneeExist(data: ConsigneeListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/customer-mgr/cms-consignee/checkExist`, data);
}

//3.收货人新增
export function consigneeAddData(data: ConsigneeListType): Promise<NormalRespType<any>> {
  return request.post(`/customer-mgr/cms-consignee/consigneeAddData`, data);
}

//4.收货人删除
export function consigneeDeleteData(data: number[], remark?: string): Promise<NormalRespType<any>> {
  return request.delete(`/customer-mgr/cms-consignee/consigneeDeleteData`, { data, params: { remark } });
}

//5.收货人修改
export function consigneeUpdateData(data: ConsigneeListType): Promise<NormalRespType<any>> {
  return request.put(`/customer-mgr/cms-consignee/consigneeUpdateData`, data );
}

//6.收货人列表数据
export function consigneePageData(data: ConsigneeSearchType): Promise<NormalRespType<NormalPageDataType<ConsigneeListType>>> {
  return request.post(`/customer-mgr/cms-consignee/consigneePageData`, data);
}
