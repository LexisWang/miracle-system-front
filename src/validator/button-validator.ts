import type { ValidatorFuncType } from "@/type/base-type";
import { checkButtonExist } from "@/service/system/button-api";

//1.菜单代码校验
export const buttonCodeCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkButtonExist({ code: value, id: extV.id, menuId: extV.menuId });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//2.菜单名称校验
export const buttonNameCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkButtonExist({ name: value, id: extV.id, menuId: extV.menuId });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};
