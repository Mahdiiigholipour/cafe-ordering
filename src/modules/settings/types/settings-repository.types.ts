import { SettingsEntity } from "../settings.entity";

export type UpdateSettingsDataType = Partial<
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
