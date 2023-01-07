import type { OrderFundListType } from "@/type/finance/normal-order-fund-type";
import type { CargoItemType } from "@/type/business/normal-cargo-type";

export interface NormalOrderListType {
  id?: number;
  name?: string;
  preCode?: string;
  orderCode?: string;
  shippingMark?: string;
  consignorId?: number;
  consignorCode?: string;
  consignorName?: string;
  consigneeId?: number;
  consigneeCode?: string;
  consigneeName?: string;
  consigneeMobile?: string;
  consigneeMobile1?: string;
  consigneeAddress?: string;
  goodsCode?: string;
  goodsName?: string;
  goodsKits?: number;
  goodsNumber?: number;
  goodsWeight?: number;
  goodsVolume?: number;
  volWeiRate?: number;
  volumeWeight?: number;
  squareNumber?: number;
  transSite?: string;
  shipSite?: string;
  deliveryAddress?: string;
  shippingSpace?: string;
  saleCategory?: number;
  orderRemark?: string;
  consignorRemark?: string;
  salesmanRemark?: string;
  attachmentUrl?: string;
  orderTime?: Date | number;
  orderStatus?: number;
  chinaRecords?: boolean;
  isHold?: number;
  parentId?: number;
  parentCode?: string;
  freightId?: number;
  prefixCode?: string;
  packTime?: Date | string;
  auditorId?: number;
  auditorName?: string;
  salesmanId?: number;
  salesmanName?: string;
  serviceId?: number;
  serviceName?: string;
  storageManIds?: number[];
  storageManIdArr?: number[];
  storageManNames?: string[];
  storageManNameArr?: string[];
  channelId?: number;
  channelName?: string;
  channelCategory?: string;
  goodTypeId?: number;
  goodTypeName?: string;
  deliveryCountry?: string;
  deliveryCity?: string;
  deliveryWay?: string;
  createTime?: Date | string;
  updateTime?: Date | string;
  creatorName?: string;
  updaterName?: string;

  fundId?: number;
  priceWeight?: number;
  unitPrice?: number;
  freightFee?: number;
  dispatchFee?: number;
  fileFee?: number;
  operateFee?: number;
  insuranceFee?: number;
  serverFee?: number;
  unloadFee?: number;
  deliveryFee?: number;
  vatFee?: number;
  otherFee?: number;
  vatSar?: number;
  insuranceRate?: number;
  insuranceMoney?: number;
  collectionMoney?: number;
  reduceAmount?: number;
  extraAmount?: number;
  otherCost?: number;
  amountReceive?: number;
  amountActual?: number;
  amountCredit?: number;
  amountUnsettle?: number;
  foreignRmb?: number;
  exchangeRate?: number;
  foreignCurrency?: number;
  singleDeclare?: boolean;
  payTypeId?: number;
  payTypeName?: string;
  fundRemark?: number;
  isAudit?: number;
  fundStatus?: number;
  ensureOrderCode?: number;

  orderFund?: OrderFundListType;
  cargos?: CargoItemType[];
}

export interface NormalOrderSearchType {
  size: number;
  current: number;
  prefixCode?: string;
  shippingMark?: string;
  consignorId?: number[];
  orderStatus?: number[];
  isHold?: number[];
  auditorId?: number[];
  salesmanId?: number[];
  serviceId?: number[];
  channelId?: number[];
  goodTypeId?: number[];
  transSite?: string;
  saleCategory?: number[];
  categoryId?: number[];
  pathwayIds?: number[];
  pathwayId?: number;
  pathwayChildId?: number;
  pathwayDetailId?: number;
  consigneeMobile?: string;
  createTimeStart?: number;
  createTimeEnd?: number;
  packTimeStart?: number;
  packTimeEnd?: number;
  orderCodes?: string;
  ids?: number[];

  includeCargo?: boolean;
}
