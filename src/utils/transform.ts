import moment from 'moment';
import type { DateTransType, ValueTransType } from "@/type/base-type";

const valueToLabel: ValueTransType = ({ row, column }, options) => {
  return options.find(item => item.value == row[column.property])?.label;
};

const dateToString: DateTransType = (value, options) => {
  switch (options) {
    case 'date':
      return moment(value).format('YYYY-MM-DD');
    case 'datetime':
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    default:
      return value;
  }
};

/*const setCellColor: (data: { row: any; column: TableColumnCtx<any> }) => CSSProperties | undefined = ({row, column}) => {
    const rowData = toRaw(row);
    const columnProp = toRaw(column);
    if (columnProp.type === 'select') {
        const color = normalStatusOpts.find(item => item.value == rowData[columnProp.property])?.color;
        return { color };
    }
};*/

const setCellColor: ValueTransType = ({ row, column }, options) => {
  return options.find(item => item.value == row[column.property])?.color;
};

export {
  valueToLabel,
  dateToString,
  setCellColor,
}
