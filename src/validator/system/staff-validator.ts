import type { ValidatorFuncType } from "@/type/base-type";
import { checkStaffExist } from "@/service/system/staff-api";

//1.职员账号校验
export const usernameCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkStaffExist({ username: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//2.职员昵称校验
export const nicknameCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkStaffExist({ nickname: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};
