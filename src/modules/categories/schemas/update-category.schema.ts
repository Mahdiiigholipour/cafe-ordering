import z from "zod";
import { ValidationMessages } from "../../../common/constants/validation.messages";

export const UpdateCategorySchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(255).nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    ValidationMessages.AT_LEAST_ONE_FIELD,
  );

export type UpdateCategoryDto = z.output<typeof UpdateCategorySchema>;
