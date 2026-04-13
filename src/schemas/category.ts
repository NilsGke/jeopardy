import z from "zod";
import { gameFieldSchema } from "./gameField";

const categoryIdSchema = z.string().regex(/^[a-zA-Z0-9 \-]+$/);

export const tagSchema = z.string().toLowerCase().trim().min(1);

export type Tag = z.infer<typeof tagSchema>;

export const categoryFileSchema = z.object({
  tags: z.array(tagSchema),
  fields: z.array(gameFieldSchema),
});

export const categorySchema = z.object({
  ...categoryFileSchema.shape,
  id: categoryIdSchema,
});

export type CategoryFile = z.infer<typeof categoryFileSchema>;
export type Category = z.infer<typeof categorySchema>;
