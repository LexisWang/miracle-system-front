import type { ValidatorFuncType } from "@/type/base-type";
import { checkOrderCodeExist } from "@/service/business/normal-order-api";

export const orderCodeCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkOrderCodeExist({ orderCode: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};
