import request from '@/utils/request';
import type { BaseOptType, NormalPageDataType, NormalRespType } from "@/type/base-type";
import type { NormalOrderListType, NormalOrderSearchType } from "@/type/business/normal-order-type";
import type { CargoItemType } from "@/type/business/normal-cargo-type";

//1.获取常规订单选项
export function canPackOrders(): Promise<NormalRespType<BaseOptType[]>> {
  return request.post(`/business-mgr/normal-order/canPackOrders`);
}

//2.校验常规订单数据是否重复
export function checkOrderCodeExist(data: NormalOrderListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/business-mgr/normal-order/checkExist`, data);
}

//3.常规订单新增
export function orderAddData(data: NormalOrderListType): Promise<NormalRespType<any>> {
  return request.post(`/business-mgr/normal-order/orderAddData`, data);
}

//4.常规订单删除
export function orderDeleteData(data: number[], remark?: string): Promise<NormalRespType<any>> {
  return request.delete(`/business-mgr/normal-order/orderDeleteData`, { data, params: { remark } });
}

//5.常规订单修改
export function orderUpdateData(data: NormalOrderListType): Promise<NormalRespType<any>> {
  return request.put(`/business-mgr/normal-order/orderUpdateData`, data );
}

//6.常规订单列表数据
export function orderPageData(data: NormalOrderSearchType): Promise<NormalRespType<NormalPageDataType<NormalOrderListType>>> {
  return request.post(`/business-mgr/normal-order/orderPageData`, data);
}

//7.获取货物列表数据
export function cargoPageData(relatedId: number): Promise<NormalRespType<CargoItemType[]>> {
  return request.post(`/business-mgr/normal-cargo/cargoPageData`, undefined, { params: { relatedId } });
}
