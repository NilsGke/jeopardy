import z from "zod";

export const tagSchema = z.string().toLowerCase().trim().min(1);
export type Tag = z.infer<typeof tagSchema>;

export const filenameIdSchema = z.string().regex(/^[a-zA-Z0-9 \-]+$/);
