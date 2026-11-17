import { AppDataSource } from "../../database/data-source";
import { TableEntity } from "./table.entity";
import { TablesRepository } from "./tables.repository";
import { TablesService } from "./tables.service";

const tablesRepository = new TablesRepository(
  AppDataSource.getRepository(TableEntity),
);

export const tablesService = new TablesService(tablesRepository);
