import path from "node:path";
import { ConflictError, InternalServerError } from "../../common/errors";
import { deleteUploadedFile } from "../../common/utils/file.util";
import env from "../../config/env";
import { SettingsResponse } from "./interfaces/settings-response.interface";
import { SettingsEntity } from "./settings.entity";
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

  async setLogo(filePath: string) {
    const relativePath = path.relative(env.UPLOADS_DIR, filePath);
    const settings = await this.getEntityOrThrow();
    const oldLogo = settings.logo;
    const updated = await this.settingsRepo.update(settings, {
      logo: relativePath,
    });

    if (oldLogo) await deleteUploadedFile(oldLogo);

    return this.toSettingsResponse(updated);
  }

  async removeLogo() {
    const settings = await this.getEntityOrThrow();
    const oldLogo = settings.logo;
    const updated = await this.settingsRepo.update(settings, { logo: null });

    if (oldLogo) await deleteUploadedFile(oldLogo);

    return this.toSettingsResponse(updated);
  }

  //----- Private helpers
  private toSettingsResponse(settings: SettingsEntity): SettingsResponse {
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
