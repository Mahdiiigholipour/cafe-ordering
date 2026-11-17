import { AppDataSource } from "../../database/data-source";
import { SettingEntity } from "./setting.entity";
import { SettingsRepository } from "./settings.repository";
import { SettingsService } from "./settings.service";

const settingsRepository = new SettingsRepository(
  AppDataSource.getRepository(SettingEntity),
);

export const settignsService = new SettingsService(settingsRepository);
