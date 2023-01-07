export interface CargoItemType {
  id?: number;
  relatedId?: number;
  relatedCode?: string;
  goodsCode?: string;
  goodsName?: string;
  numberCode?: string;
  deliveryCode?: string;
  goodKits?: number;
  goodNumber?: number;
  goodWeight?: number;
  goodsKits?: number;
  goodsWeight?: number;
  goodsLength?: number;
  goodsWidth?: number;
  goodsHeight?: number;
  goodsVolume?: number;
  goodSquare?: number;
  attachment?: string;
  deliveryTime?: Date | string | number;
  totalKits?: number;
  currentKits?: number;
  deleted?: boolean;
}
