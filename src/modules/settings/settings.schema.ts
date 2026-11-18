import z from "zod";
import { ValidationMessages } from "../../common/constants/validation.messages";
import { SettingsMessages } from "./settings.messages";

const TimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, SettingsMessages.INVALID_TIME_FORMAT);

const PercentSchema = z.number().int().min(0).max(100);

export const UpdateSettingsSchema = z
  .object({
    cafeName: z.string().trim().min(2).max(100),
    openingTime: TimeSchema,
    closingTime: TimeSchema,
    taxPercent: PercentSchema,
    servicePercent: PercentSchema,
  })
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: ValidationMessages.AT_LEAST_ONE_FIELD,
  })
  .refine(
    (data) =>
      data.openingTime === undefined ||
      data.closingTime === undefined ||
      data.openingTime !== data.closingTime,
    {
      message: SettingsMessages.OPENING_AND_CLOSING_TIME_MUST_DIFFER,
      path: ["closingTime"],
    },
  );

export type UpdateSettingsDto = z.output<typeof UpdateSettingsSchema>;
