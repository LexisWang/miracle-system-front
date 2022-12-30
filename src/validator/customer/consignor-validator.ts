import type { ValidatorFuncType } from "@/type/base-type";
import type { ConsignorListType } from "@/type/customer/consignor-type";
import { checkConsignorExist } from "@/service/customer/consignor-api";

export const consignorCodeCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkConsignorExist({ consignorCode: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

export const consignorNameCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const { data: { ok, msg } } = await checkConsignorExist({ consignorName: value, id: extV });
  if (ok) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

//手机号 微信号 QQ号 其他号 必须有一个
export const consignorContactCheck: ValidatorFuncType = async (r, value, callback, v, valida, extV) => {
  const formData: ConsignorListType = extV;
  if (!formData.phoneNumber && !formData.wechatNumber && !formData.qqNumber && !formData.otherNumber) {
    callback(new Error("四个联系号最少填写一个"));
  } else {
    callback();
  }
};
