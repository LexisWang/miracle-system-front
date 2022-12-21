import type { ValidatorFuncType } from "@/type/base-type";
import { checkDictExist } from "@/service/system/dict-api";
import { checkValueExist } from "@/service/system/value-api";

//1.字典代码校验
export const dictCodeCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkDictExist({ dictCode: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//2.字典名称校验
export const dictNameCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkDictExist({ dictName: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//3.配置值代码校验
export const valueCodeCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkValueExist({ valueCode: value, id: extV.id, dictId: extV.dictId });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//4.配置值名称校验
export const valueNameCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkValueExist({ valueName: value, id: extV.id, dictId: extV.dictId });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};
