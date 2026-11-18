import { Request, Response } from "express";
import { UploadsMessages } from "../../common/constants/uploads.messages";
import { BadRequestError } from "../../common/errors";
import { SettingsMessages } from "./settings.messages";
import { UpdateSettingsDto } from "./settings.schema";
import { SettingsService } from "./settings.service";

export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  getSettings = async (_req: Request, res: Response) => {
    const settings = await this.settingsService.get();
    return res.status(200).json({ success: true, data: settings });
  };

  updateSettings = async (_req: Request, res: Response) => {
    const dto: UpdateSettingsDto = res.locals.validatedBody;
    const settings = await this.settingsService.update(dto);

    return res.status(200).json({
      success: true,
      message: SettingsMessages.SETTINGS_UPDATED,
      data: settings,
    });
  };

  setLogo = async (req: Request, res: Response) => {
    if (!req.file) throw new BadRequestError(UploadsMessages.FILE_REQUIRED);

    const settings = await this.settingsService.setLogo(req.file.path);
    return res.status(200).json({
      success: true,
      message: SettingsMessages.SETTINGS_UPDATED,
      data: settings,
    });
  };

  removeLogo = async (req: Request, res: Response) => {
    const settings = await this.settingsService.removeLogo();
    return res.status(200).json({
      success: true,
      message: SettingsMessages.SETTINGS_UPDATED,
      data: settings,
    });
  };
}
