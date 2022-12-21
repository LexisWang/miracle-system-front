import request from '@/utils/request';
import type { NormalRespType, UploadExtraDataType, UploadRespDataType } from "@/type/base-type";

//1.上传附件
export function miracleUpload(data: FormData): Promise<NormalRespType<UploadRespDataType>> {
  return request.post(`/common-mgr/comm-attachment/uploadByRelatedId`, data, { headers: { "Content-Type": "multipart/form-data" } });
}

//2.获取附件列表
export function attachmentList(data: UploadExtraDataType): Promise<NormalRespType<UploadRespDataType[]>> {
  return request.post(`/common-mgr/comm-attachment/attachmentList`, data);
}

//3.删除附件
export function deleteAttachment(data: UploadRespDataType): Promise<NormalRespType<any>> {
  return request.delete(`/common-mgr/comm-attachment/deleteAttachment`, { data });
}
