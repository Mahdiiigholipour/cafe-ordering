import { NextFunction, Request, Response } from "express";
import { SettingsMessages } from "./settings.messages";
import { UpdateSettingsDto } from "./settings.schema";
import { SettingsService } from "./settings.service";

export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    const settings = await this.settingsService.get();
    return res.status(200).json({ success: true, data: settings });
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    const dto: UpdateSettingsDto = res.locals.validatedBody;
    const settings = await this.settingsService.update(dto);

    return res.status(200).json({
      success: true,
      message: SettingsMessages.SETTINGS_UPDATED,
      data: settings,
    });
  };
}
