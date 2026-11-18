import { TableEntity } from "../table.entity";

export type FilterTablesDataType = Partial<Pick<TableEntity, "isActive">>;

export type CreateTableDataType = Pick<TableEntity, "number" | "qrToken">;

export type UpdateTableDataType = Partial<
  Pick<TableEntity, "number" | "isActive">
>;
