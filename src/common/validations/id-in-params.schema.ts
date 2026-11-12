import z from "zod";

export const IdInParamsSchema = z.object({
  id: z.string().uuid({ version: "v4" }),
});

export type IdInParamsDto = z.output<typeof IdInParamsSchema>;
