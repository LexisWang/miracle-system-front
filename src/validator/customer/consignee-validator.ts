import type { ValidatorFuncType } from "@/type/base-type";
import { checkConsigneeExist } from "@/service/customer/consignee-api";

export const consigneeCodeCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkConsigneeExist({ consignorCode: value, id: extV.id, consignorId: extV.consignorId });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

export const consigneeNameCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkConsigneeExist({ consignorName: value, id: extV.id, consignorId: extV.consignorId });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};