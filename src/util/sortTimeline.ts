import type { TimelineElement } from "@/schemas/gameField";

const sortTimeline = (a: TimelineElement, b: TimelineElement) =>
  a.start === b.start ? a.end - b.end : a.start - b.start;

export default sortTimeline;
