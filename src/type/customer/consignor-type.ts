export interface ConsignorListType {
  id?: number;
  name?: string;
  sortCode?: string;
  consignorCode?: string;
  consignorName?: string;
  president?: string;
  phoneNumber?: string;
  wechatNumber?: string;
  qqNumber?: string;
  otherNumber?: string;
  address?: string;
  consignorStatus?: number;
  salesmanId?: number;
  salesmanName?: string;
  toSalesmanId?: number;
  toSalesmanName?: string;
  lastSalesmanId?: number;
  lastSalesmanName?: string;
  serviceId?: number;
  serviceName?: string;
  categoryId?: number;
  categoryName?: string;
  pathwayIds?: number[];
  pathwayId?: number;
  pathwayName?: string;
  pathwayChildId?: number;
  pathwayChildName?: string;
  pathwayDetailId?: number;
  pathwayDetailName?: string;
  rankId?: number;
  rankName?: string;
  consignorRemark?: string;
  profitRate?: number;
  firstOrderTime?: Date | string;
  lastOrderTime?: Date | string;
  debtThreshold?: number;
  debtPeriod?: number;
  accountBalance?: number;
  destClerk?: string;
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

export interface ConsignorSearchType {
  size: number;
  current: number;
  consignorCode?: string;
  consignorName?: string;
  sortCode?: string;
  consignorStatus?: number[];
  creditStatus?: number[];
  salesmanId?: number;
  toSalesmanId?: number;
  lastSalesmanId?: number;
  serviceId?: number;
  categoryId?: number;
  pathwayIds?: number[];
  pathwayId?: number;
  pathwayChildId?: number;
  pathwayDetailId?: number;
  rankId?: number;
  firstOrderTimeStart?: number;
  firstOrderTimeEnd?: number;
  lastOrderTimeStart?: number;
  lastOrderTimeEnd?: number;
  ids?: number[];

  includeConsignee?: boolean;
}