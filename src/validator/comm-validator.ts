import type { ValidatorFuncType } from "@/type/base-type";

//1.账号校验
export const usernameCheck: ValidatorFuncType = async (_, value, callback) => {
  const reg = /(^[a-zA-Z0-9-_]{4,16}$)/
  if (value === '') {
    callback(new Error('请输入用户名'));
  } else if (!reg.test(value)) {
    callback(new Error('请输入4-16位账号'));
  } else {
    callback();
  }
};

//2.不能包含空格
export const notIncludeSpaceValid: ValidatorFuncType = async (_, value, callback) => {
  const reg = /\s/;
  if (reg.test(value)) {
    callback(new Error("不能包含空格"));
  } else {
    callback();
  }
};

//只能是数字
export const onlyDigitalValid: ValidatorFuncType = async (_, value, callback) => {
  const reg = /^\d+$/;
  if (value && !reg.test(value)) {
    callback(new Error("只能输入数字"));
  } else {
    callback();
  }
};

//只能是数字和中横线
export const onlyDigitalOrHyphenValid: ValidatorFuncType = async (_, value, callback) => {
  const reg = /^[\d-]+$/;
  if (value && !reg.test(value)) {
    callback(new Error("只能输入数字和中横线"));
  } else {
    callback();
  }
};

//只能是数字和中横线及英文逗号
export const onlyDigitalHyphenComma: ValidatorFuncType = async (_, value, callback) => {
  const reg = /^[\d-,]+$/;
  if (value && !reg.test(value)) {
    callback(new Error("只能输入数字,中横线,英文逗号"));
  } else {
    callback();
  }
};

//只能填写浮点数
export const onlyFloatNumber: ValidatorFuncType = async (_, value, callback) => {
  if (parseFloat(value).toString() === "NaN") {
    callback(new Error("只能输入数值"));
  } else {
    callback();
  }
};
