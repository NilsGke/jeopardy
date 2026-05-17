import z from "zod";
import { filenameIdSchema, tagSchema } from "./global";

export const gameFileSchema = z.object({
  tags: z.array(tagSchema),
  categories: z.array(filenameIdSchema),
});

export const gameSchema = z.object({
  ...gameFileSchema.shape,
  id: filenameIdSchema,
});
