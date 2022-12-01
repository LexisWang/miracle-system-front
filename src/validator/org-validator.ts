import type { ValidatorFuncType } from "@/type/base-type";
import { checkOrgExist } from "@/service/system/org-api";

//1.部门组织代码校验
export const orgCodeCheck: ValidatorFuncType = async (_, value, callback) => {
  const { data: { ok, msg } } = await checkOrgExist({ orgCode: value });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//2.部门组织名称校验
export const orgNameCheck: ValidatorFuncType = async (_, value, callback) => {
  const { data: { ok, msg } } = await checkOrgExist({ orgName: value });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};
