import {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
} from "@platejs/table";

import {
  TableCellElementStatic,
  TableCellHeaderElementStatic,
  TableElementStatic,
  TableRowElementStatic,
} from "@/components/plate-ui/table-node-static";

export const BaseTableKit = [
  BaseTableCellHeaderPlugin.withComponent(TableCellHeaderElementStatic),
  BaseTableCellPlugin.withComponent(TableCellElementStatic),
  BaseTablePlugin.withComponent(TableElementStatic),
  BaseTableRowPlugin.withComponent(TableRowElementStatic),
];
