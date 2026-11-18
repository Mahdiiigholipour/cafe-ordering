import { AppDataSource } from "../../database/data-source";
import { SettingsEntity } from "./settings.entity";
import { SettingsRepository } from "./settings.repository";
import { SettingsService } from "./settings.service";

const settingsRepository = new SettingsRepository(
  AppDataSource.getRepository(SettingsEntity),
);

export const settingsService = new SettingsService(settingsRepository);
