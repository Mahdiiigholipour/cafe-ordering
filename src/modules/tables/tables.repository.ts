import { FindOptionsWhere, Repository } from "typeorm";
import { TableEntity } from "./table.entity";
import {
  CreateTableDataType,
  FilterTablesDataType,
  UpdateTableDataType,
} from "./types/tables-repository.types";

export class TablesRepository {
  constructor(private readonly repository: Repository<TableEntity>) {}

  async findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async findByNumber(number: number) {
    return this.repository.findOne({ where: { number } });
  }

  async findAll(filters?: FilterTablesDataType) {
    const where: FindOptionsWhere<TableEntity> = {};
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return this.repository.find({ where, order: { number: "ASC" } });
  }

  async create(data: CreateTableDataType) {
    const table = this.repository.create(data);
    return this.repository.save(table);
  }

  async update(table: TableEntity, data: UpdateTableDataType) {
    if (data.number !== undefined) table.number = data.number;
    if (data.isActive !== undefined) table.isActive = data.isActive;

    return this.repository.save(table);
  }
}
