import z from "zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(20),
  password: z.string().trim().max(72),
});

export type LoginDto = z.output<typeof LoginSchema>;
