import { Request, Response } from "express";
import { IdInParamsDto } from "../../common/validations/id-in-params.schema";
import { TablesMessages } from "./tables.messages";
import {
  CreateTableDto,
  ListTablesQueryDto,
  UpdateTableDto,
} from "./tables.schema";
import { TablesService } from "./tables.service";

export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  getTablesList = async (_req: Request, res: Response) => {
    const query: ListTablesQueryDto = res.locals.validatedQuery;

    const tables = await this.tablesService.list(query);

    return res.status(200).json({ success: true, data: tables });
  };

  createTable = async (_req: Request, res: Response) => {
    const dto: CreateTableDto = res.locals.validatedBody;
    const table = await this.tablesService.create(dto);

    return res.status(201).json({
      success: true,
      message: TablesMessages.TABLE_CREATED,
      data: table,
    });
  };

  getTableById = async (_req: Request, res: Response) => {
    const params: IdInParamsDto = res.locals.validatedParams;
    const table = await this.tablesService.getById(params.id);

    return res.status(200).json({ success: true, data: table });
  };

  updateTable = async (_req: Request, res: Response) => {
    const params: IdInParamsDto = res.locals.validatedParams;
    const dto: UpdateTableDto = res.locals.validatedBody;
    const table = await this.tablesService.update(params.id, dto);

    return res.status(200).json({
      success: true,
      message: TablesMessages.TABLE_UPDATED,
      data: table,
    });
  };

  getQrImage = async (_req: Request, res: Response) => {
    const params: IdInParamsDto = res.locals.validatedParams;
    const { qrBuffer, tableNumber } = await this.tablesService.getQrImage(
      params.id,
    );

    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="table-${tableNumber}.png"`,
      "Cache-Control": "no-store",
    });
    return res.send(qrBuffer);
  };
}
