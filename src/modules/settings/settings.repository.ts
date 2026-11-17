import { Repository } from "typeorm";
import { SettingEntity } from "./setting.entity";
import { UpdateSettingsDto } from "./settings.schema";

export class SettingsRepository {
  constructor(private readonly repository: Repository<SettingEntity>) {}

  async find() {
    return this.repository.findOne({ where: {} });
  }

  async update(settings: SettingEntity, data: UpdateSettingsDto) {
    if (data.cafeName !== undefined) settings.cafeName = data.cafeName;
    if (data.servicePercent !== undefined)
      settings.servicePercent = data.servicePercent;
    if (data.taxPercent !== undefined) settings.taxPercent = data.taxPercent;
    if (data.openingTime !== undefined) settings.openingTime = data.openingTime;
    if (data.closingTime !== undefined) settings.closingTime = data.closingTime;

    return this.repository.save(settings);
  }
}
