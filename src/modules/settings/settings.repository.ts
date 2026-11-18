import { Repository } from "typeorm";
import { SettingsEntity } from "./settings.entity";

type SettingsUpdateData = Partial<
  Pick<
    SettingsEntity,
    | "cafeName"
    | "openingTime"
    | "closingTime"
    | "taxPercent"
    | "servicePercent"
    | "logo"
  >
>;

export class SettingsRepository {
  constructor(private readonly repository: Repository<SettingsEntity>) {}

  async find() {
    return this.repository.findOne({ where: {} });
  }

  async update(settings: SettingsEntity, data: SettingsUpdateData) {
    if (data.cafeName !== undefined) settings.cafeName = data.cafeName;
    if (data.servicePercent !== undefined)
      settings.servicePercent = data.servicePercent;
    if (data.taxPercent !== undefined) settings.taxPercent = data.taxPercent;
    if (data.openingTime !== undefined) settings.openingTime = data.openingTime;
    if (data.closingTime !== undefined) settings.closingTime = data.closingTime;
    if (data.logo !== undefined) settings.logo = data.logo;

    return this.repository.save(settings);
  }
}
