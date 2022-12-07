import type { ValidatorFuncType } from "@/type/base-type";
import { checkRoleExist } from "@/service/system/role-api";

//1.角色代码校验
export const roleCodeCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkRoleExist({ roleCode: value, id: extV.id, orgId: extV.orgId });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//2.角色名称校验
export const roleNameCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkRoleExist({ roleName: value, id: extV.id, orgId: extV.orgId });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};
