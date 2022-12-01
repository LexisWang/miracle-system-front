import type { ValidatorFuncType } from "@/type/base-type";
import { checkPermExist } from "@/service/system/menu-api";

//1.菜单代码校验
export const menuCodeCheck: ValidatorFuncType = async (_, value, callback) => {
  const { data: { ok, msg } } = await checkPermExist({ menuCode: value });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//2.菜单名称校验
export const menuNameCheck: ValidatorFuncType = async (_, value, callback) => {
  const { data: { ok, msg } } = await checkPermExist({ menuName: value });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};
