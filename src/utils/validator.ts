import type { ValidatorFuncType } from "@/type/base-type";

//1.账号校验
export const usernameCheck: ValidatorFuncType = async (_, value, callback) => {
  const reg = /(^[a-zA-Z0-9]{4,16}$)/
  if (value === '') {
    callback(new Error('请输入用户名'));
  } else if (!reg.test(value)) {
    callback(new Error('请输入4-16位账号'));
  } else {
    callback();
  }
};
