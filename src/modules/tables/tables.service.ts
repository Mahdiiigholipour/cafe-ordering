import { randomBytes } from "node:crypto";
import QRCode from "qrcode";
import { ConflictError, NotFoundError } from "../../common/errors";
import env from "../../config/env";
import { TableEntity } from "./table.entity";
import { TablesMessages } from "./tables.messages";
import { TablesRepository } from "./tables.repository";
import {
  CreateTableDto,
  ListTablesQueryDto,
  UpdateTableDto,
} from "./tables.schema";
import { TablesResponse } from "./types/tables-response.interface";

export class TablesService {
  constructor(private readonly tablesRepo: TablesRepository) {}

  async getAll(filters: ListTablesQueryDto) {
    const tables = await this.tablesRepo.findAll(filters);
    return tables.map((table) => this.toResponse(table));
  }

  async getById(id: string) {
    const table = await this.getEntityOrThrow(id);

    return this.toResponse(table);
  }

  async create(dto: CreateTableDto) {
    const existsTable = await this.tablesRepo.findByNumber(dto.number);
    if (existsTable)
      throw new ConflictError(TablesMessages.TABLE_NUMBER_CONFLICT);

    const qrToken = randomBytes(32).toString("hex");

    const table = await this.tablesRepo.create({ qrToken, number: dto.number });

    return this.toResponse(table);
  }

  async update(id: string, dto: UpdateTableDto) {
    const table = await this.getEntityOrThrow(id);

    if (dto.number !== undefined && dto.number !== table.number) {
      const existsTable = await this.tablesRepo.findByNumber(dto.number);
      if (existsTable)
        throw new ConflictError(TablesMessages.TABLE_NUMBER_CONFLICT);
    }

    const updated = await this.tablesRepo.update(table, dto);
    return this.toResponse(updated);
  }

  async getQrImage(id: string) {
    const table = await this.getEntityOrThrow(id);
    const url = new URL("/menu", env.FRONTEND_BASE_URL);
    url.searchParams.set("table", table.qrToken);

    const qrBuffer = await QRCode.toBuffer(url.toString(), {
      type: "png",
      errorCorrectionLevel: "M",
      width: 512,
      margin: 2,
    });

    return { qrBuffer, tableNumber: table.number };
  }

  //---- Private helpers -----
  private toResponse(table: TableEntity): TablesResponse {
    return {
      id: table.id,
      number: table.number,
      isActive: table.isActive,
      createdAt: table.createdAt,
      updatedAt: table.updatedAt,
    };
  }

  private async getEntityOrThrow(id: string) {
    const table = await this.tablesRepo.findById(id);
    if (!table) throw new NotFoundError(TablesMessages.TABLE_NOT_FOUND);

    return table;
  }
}
