import { randomBytes } from "node:crypto";
import { ConflictError, NotFoundError } from "../../common/errors";
import { TableResponse } from "./interfaces/table-response.interface";
import { TableEntity } from "./table.entity";
import { TablesMessages } from "./tables.messages";
import { TablesRepository } from "./tables.repository";
import {
  CreateTableDto,
  ListTablesQueryDto,
  UpdateTableDto,
} from "./validation.schemas";

export class TablesService {
  constructor(private readonly tablesRepo: TablesRepository) {}

  async getAll(filters: ListTablesQueryDto) {
    const tables = await this.tablesRepo.findAll(filters);
    return tables.map((table) => this.toTableResponse(table));
  }

  async getById(id: string) {
    const table = await this.getEntityOrThrow(id);

    return this.toTableResponse(table);
  }

  async create(dto: CreateTableDto) {
    const existsTable = await this.tablesRepo.findByNumber(dto.number);
    if (existsTable)
      throw new ConflictError(TablesMessages.TABLE_NUMBER_CONFLICT);

    const qrToken = randomBytes(32).toString("hex");

    const table = await this.tablesRepo.create({ qrToken, number: dto.number });

    return this.toTableResponse(table);
  }

  async update(id: string, dto: UpdateTableDto) {
    const table = await this.getEntityOrThrow(id);

    if (dto.number !== undefined && dto.number !== table.number) {
      const existsTable = await this.tablesRepo.findByNumber(dto.number);
      if (existsTable)
        throw new ConflictError(TablesMessages.TABLE_NUMBER_CONFLICT);
    }

    const updated = await this.tablesRepo.update(table, dto);
    return this.toTableResponse(updated);
  }

  //---- Private helpers -----
  private toTableResponse(table: TableEntity): TableResponse {
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
