import type { TimelineElementType } from "@/schemas/gameField";

const sortTimeline = (a: TimelineElementType, b: TimelineElementType) =>
  a.start === b.start ? a.end - b.end : a.start - b.start;

export default sortTimeline;
