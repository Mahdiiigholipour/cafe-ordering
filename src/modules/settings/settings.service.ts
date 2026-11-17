import { ConflictError, InternalServerError } from "../../common/errors";
import { SettingsResponse } from "./interfaces/settings-response.interface";
import { SettingEntity } from "./setting.entity";
import { SettingsMessages } from "./settings.messages";
import { SettingsRepository } from "./settings.repository";
import { UpdateSettingsDto } from "./settings.schema";

export class SettingsService {
  constructor(private readonly settingsRepo: SettingsRepository) {}

  async get() {
    const settings = await this.getEntityOrThrow();
    return this.toSettingsResponse(settings);
  }

  async update(dto: UpdateSettingsDto) {
    const settings = await this.getEntityOrThrow();

    const openingTime =
      dto.openingTime ?? this.normalizeTime(settings.openingTime);
    const closingTime =
      dto.closingTime ?? this.normalizeTime(settings.closingTime);

    if (openingTime === closingTime)
      throw new ConflictError(SettingsMessages.SAME_OPENING_AND_CLOSING_TIME);

    const updated = await this.settingsRepo.update(settings, dto);
    return this.toSettingsResponse(updated);
  }

  //----- Private helpers
  private toSettingsResponse(settings: SettingEntity): SettingsResponse {
    return {
      cafeName: settings.cafeName,
      logo: settings.logo,
      openingTime: settings.openingTime,
      closingTime: settings.closingTime,
      taxPercent: settings.taxPercent,
      servicePercent: settings.servicePercent,
      updatedAt: settings.updatedAt,
    };
  }

  private async getEntityOrThrow() {
    const settings = await this.settingsRepo.find();
    if (!settings) throw new InternalServerError("Settings not found");

    return settings;
  }

  private normalizeTime(value: string): string {
    return value.slice(0, 5);
  }
}
