import z from "zod";

export const timelineContentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    content: z.string(),
  }),
  z.object({
    type: z.literal("image"),
    id: z.string(),
  }),
  z.object({
    type: z.literal("sound"),
    id: z.string(),
    volume: z.number().int().min(0).max(100),
  }),
  z.object({
    type: z.literal("video"),
    id: z.string(),
    volume: z.number().int().min(0).max(100),
  }),
]);

export const timelineElementSchema = timelineContentSchema.and(
  z.object({
    start: z.number().int().min(0),
    end: z.number().int().min(0),
  }),
);

export const timelineSchema = z.array(timelineElementSchema);

export const gameFieldSchema = z.object({
  timeline: timelineSchema,
  // answerIndex: z.number().int().min(0),
  points: z.number().int().min(0),
});

export type GameField = z.infer<typeof gameFieldSchema>;
export type Timeline = z.infer<typeof timelineSchema>;
export type TimelineElement = z.infer<typeof timelineElementSchema>;
