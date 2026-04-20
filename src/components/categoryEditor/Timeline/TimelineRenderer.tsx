import type { Timeline } from "@/schemas/gameField";
import TimelineElementRenderer from "./TimelineElementRenderer";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import withViewTransition from "@/util/withViewTransition";
import sortTimeline from "@/util/sortTimeline";

export default function TimelineRenderer({
  timeline,
  cursorIndex: externalCursorIndex,
  className,
}: {
  timeline: Timeline;
  cursorIndex: number;
  className?: string;
}) {
  const initialRender = useRef(true);

  const [cursorPos, setCursorPos] = useState(externalCursorIndex);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    withViewTransition(() => setCursorPos(externalCursorIndex));
  }, [externalCursorIndex]);

  const activeElements = timeline
    .filter((elm) => elm.start <= cursorPos + 0.5 && elm.end >= cursorPos + 0.5)
    .sort(sortTimeline);
  console.log(cursorPos);

  return (
    <div
      className={cn(
        "flex justify-center items-center flex-wrap gap-[5%] rounded-2xl border p-4 aspect-video",
        className,
      )}
    >
      {activeElements.map((element) => (
        <TimelineElementRenderer key={element.id} element={element} />
      ))}
    </div>
  );
}
