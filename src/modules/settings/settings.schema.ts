import z from "zod";

const TimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format");

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
    message: "At least one field is required",
  })
  .refine(
    (data) =>
      data.openingTime === undefined ||
      data.closingTime === undefined ||
      data.openingTime !== data.closingTime,
    {
      message: "Opening and closing time cannot be equal",
      path: ["closingTime"],
    },
  );

export type UpdateSettingsDto = z.output<typeof UpdateSettingsSchema>;
