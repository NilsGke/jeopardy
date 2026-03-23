import z from "zod";
import { gameFieldSchema } from "./gameField";

const categoryIdSchema = z.string().regex(/^[a-zA-Z0-9 \-]+$/);

const tagSchema = {
  name: z.string().regex(/[a-zA-Z0-9\-]+/),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
};

export const categoryFileSchema = z.object({
  tags: z.array(tagSchema.name),
  fields: z.array(gameFieldSchema),
});

export const categorySchema = z.object({
  ...categoryFileSchema.shape,
  id: categoryIdSchema,
});

export type Category = z.infer<typeof categorySchema>;
