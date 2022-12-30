import type { ValidatorFuncType } from "@/type/base-type";
import { checkPermExist } from "@/service/system/perm-api";

//1.权限代码校验
export const permCodeCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkPermExist({ permCode: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//2.权限名称校验
export const permNameCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkPermExist({ permName: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};
