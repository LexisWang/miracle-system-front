import request from '@/utils/request';
import type { NormalPageDataType, NormalRespType } from "@/type/base-type";
import type { DictListType, DictSearchType } from "@/type/system/dict-type";

//1.校验字典数据是否重复
export function checkDictExist(data: DictListType): Promise<NormalRespType<{ ok: boolean; msg: string }>> {
  return request.post(`/system-mgr/bim-dict/checkExist`, data);
}

//2.字典新增
export function dictAddData(data: DictListType): Promise<NormalRespType<any>> {
  return request.post(`/system-mgr/bim-dict/dictAddData`, data);
}

//3.字典删除
export function dictDeleteData(data: number[], remark?: string): Promise<NormalRespType<any>> {
  return request.delete(`/system-mgr/bim-dict/dictDeleteData`, { data, params: { remark } });
}

//4.字典修改
export function dictUpdateData(data: DictListType): Promise<NormalRespType<any>> {
  return request.put(`/system-mgr/bim-dict/dictUpdateData`, data );
}

//5.字典列表数据
export function dictPageData(data: DictSearchType): Promise<NormalRespType<NormalPageDataType<DictListType>>> {
  return request.post(`/system-mgr/bim-dict/dictPageData`, data);
}

//6.导出字典
export function dictExportData(data: DictSearchType) {
  return request.post(`/system-mgr/bim-dict/dictExportData`, data, { responseType: 'blob' });
}
