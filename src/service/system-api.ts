import request from '@/utils/request';
import type { AxiosResponse } from "axios";
import type { ListResponseType } from "@/type/base-type";
import type { LoginFormModel, LoginResDto } from "@/type/layout-type";
import type { OrgPageDataType, OrgSearchType } from "@/type/organization-type";

//1.用户登录
export function staffLoginApi(data: LoginFormModel): Promise<AxiosResponse<LoginResDto>> {
  // return request.post(`dev-api/system/admin/staffLogin`, data);
  return request.post(`/system/admin/staffLogin`, data);
}

//2.获取分部组织列表
export function orgListApi(searchParam: OrgSearchType): Promise<ListResponseType<OrgPageDataType>> {
  // return request.post(`dev-api/system-mgr/sys-org/orgPageData`, searchParam);
  return request.post(`/system/org/listData`, searchParam);
}

//测试后端接口
export function createPerson(data: object) {
  return request.post(`dev-api/system/admin/createPerson`, data);
}
