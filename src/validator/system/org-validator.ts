import type { ValidatorFuncType } from "@/type/base-type";
import { checkOrgExist } from "@/service/system/org-api";

//1.部门组织代码校验
export const orgCodeCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkOrgExist({ orgCode: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//2.部门组织名称校验
export const orgNameCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkOrgExist({ orgName: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};
