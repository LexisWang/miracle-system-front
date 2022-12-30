export interface ConsigneeListType {
  id?: number;
  name?: string;
  consignorId?: number;
  consignorCode?: string;
  consignorName?: string;
  consigneeCode?: string;
  consigneeName?: string;
  deliveryMobile?: string;
  deliveryMobile1?: string;
  deliveryAddress?: string;
  consigneeStatus?: number;
  consigneeRemark?: string;
  createTime?: Date | string;
  updateTime?: Date | string;
  creatorId?: number;
  creatorName?: string;
  updaterId?: number;
  updaterName?: string;
  version?: number;
  deleted?: boolean;

  isUpdateStatus?: boolean;
}

export interface ConsigneeSearchType {
  size: number;
  current: number;
  consignorId?: number;
  consigneeCode?: string;
  consigneeName?: string;
  consigneeStatus?: number[];
}