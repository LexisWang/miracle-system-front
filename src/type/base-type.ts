import type { DefineComponent } from "vue";
import type { TableColumnCtx } from "element-plus/lib/components/table/src/table-column/defaults";
import type { InternalRuleItem, ValidateOption, Value, Values } from "async-validator/dist-types/interface";

export type ValueTransType = (
    scope: { row: any; column: TableColumnCtx<any> },
    options: BaseOptType[],
    type?: string) => string | undefined;

export type DateTransType = (value: string, type: string) => string | undefined;

export type ValidatorFuncType = (rule: InternalRuleItem, value: Value, callback: (error?: string | Error) => void, source: Values, options: ValidateOption, extV?: any) => void | Promise<void>;

export type FormItemTypeEnum = 'input' | 'select' | 'date-picker' | 'autocomplete' | 'cascade' | 'button'
    | 'textArea' | 'radio' | 'number';

export interface FormRuleType {
  required?: boolean;
  message?: string;
  trigger?: string;
  validator?: ValidatorFuncType;
}

export interface ElPermissionType {
  code?: string;
  name?: string;
}

export interface AddEditButtonType {
  permission?: ElPermissionType;
  onClick: () => void;
}

export interface TagDataType {
  name: string;
  path: string;
  title: string;
}

export interface SuggestItemType {
  value: string;
  code?: number;
}

export interface CascadeItemType {
  value: string;
  label: string;
  code?: number;
  children?: CascadeItemType[];
}

export interface BaseOptType {
  value: number | string | boolean;
  label: string;
  color?: string;
  id?: number;
}

export interface TreeOptType {
  value: number;
  label: string;
  scopeKey?: string;
  children?: TreeOptType[];
}

export interface NumberOptionsTYpe {
  symbol?: string;
  format?: string;
  thousand?: string;
  decimal?: string;
  precision?: string;
}

export interface SearchColumnType {
  prop: string;
  label?: string;
  span?: number;
  min?: number;
  maxlength?: number;
  slotName?: string;
  disabled?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  collapseTags?: boolean;
  placeholder?: string;
  endTimeStr?: string;
  startTimeStr?: string;
  addPermission?: ElPermissionType;
  type: FormItemTypeEnum;
  options?: NumberOptionsTYpe;
  onChange?: (v: any) => void;
  onSelect?: (v: any) => void;
  onBlur?: (v: any) => void;
  class?: string;
  pickerOptions?: any;
  format?: (v: any) => string;
  children?: any;
}

export interface ListColumnType {
  prop: string;
  label: string;
  fixed?: 'left' | 'right' | 'top';
  formatter?: DateTransType;
  enumTrans?: ValueTransType;
  multiple?: boolean;
  width?: number;
  min?: number;
  max?: number;
  options?: NumberOptionsTYpe;
  maxlength?: number;
  placeholder?: string;
  rules?: FormRuleType[];
  type?: 'input' | 'number' | 'select' | 'date' | 'datetime' | 'autocomplete' | 'cascade' | 'button';
}

export interface OperateMenuType {
  name?: string;
  icon: DefineComponent;
  key: string;
  callback?: (params?: any) => void;
  isConfirm?: boolean;
  confirmType?: 'switch' | 'reset' | 'delete';
  permission?: ElPermissionType;
}

export interface SummaryMethodProps<T> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

export interface NormalRespType<T> {
  success: boolean;
  code: number;
  msg: string;
  data: T;
}

export interface NormalPageDataType<T> {
  total: number;
  pages: number;
  records: T[];
}
