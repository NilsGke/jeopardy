import z from "zod";
import { gameFieldSchema } from "./gameField";
import { filenameIdSchema, tagSchema } from "./global";

export const categoryFileSchema = z.object({
  tags: z.array(tagSchema),
  fields: z.array(gameFieldSchema),
});

export const categorySchema = z.object({
  ...categoryFileSchema.shape,
  id: filenameIdSchema,
});

export type CategoryFile = z.infer<typeof categoryFileSchema>;
export type Category = z.infer<typeof categorySchema>;
