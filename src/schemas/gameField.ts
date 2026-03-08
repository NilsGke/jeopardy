import z from "zod";

export const timelineElementSchema = z.discriminatedUnion("type", [
  z.object({
    type: "text",
    content: z.string(),
  }),
  z.object({
    type: "image",
    id: z.string(),
  }),
  z.object({
    type: "sound",
    id: z.string(),
    volume: z.number().int().min(0).max(100),
  }),
  z.object({
    type: "video",
    id: z.string(),
    volume: z.number().int().min(0).max(100),
  }),
]);

export const indexedTimelineElementSchema = {
  ...timelineElementSchema,
  start: z.number().int().min(0),
  end: z.number().int().min(0),
};

export const gameFieldSchema = z.object({
  timeline: z.array(indexedTimelineElementSchema),
  answerIndex: z.number().int().min(0),
  points: z.number().int().min(0),
});
