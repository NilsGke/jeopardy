import type { TimelineType } from "@/schemas/gameField";
import TimelineElementRenderer from "./TimelineElementRenderer";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type RefObject } from "react";
import withViewTransition from "@/util/withViewTransition";
import sortTimeline from "@/util/sortTimeline";

function getActiveElements(timeline: TimelineType, cursor: number) {
  return timeline
    .filter((elm) => elm.start <= cursor + 0.5 && elm.end >= cursor + 0.5)
    .sort(sortTimeline);
}

function sameIds(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default function TimelineRenderer({
  timeline,
  cursorIndexRef,
  className,
}: {
  timeline: TimelineType;
  cursorIndexRef: RefObject<number>;
  className?: string;
}) {
  const [activeElements, setActiveElements] = useState(() =>
    getActiveElements(timeline, cursorIndexRef.current),
  );

  const activeIdsRef = useRef(activeElements.map((e) => e.id));
  const isTransitioning = useRef(false);
  const pendingRef = useRef<null | TimelineType>(null);

  useEffect(() => {
    function startTransition(next: TimelineType) {
      isTransitioning.current = true;

      withViewTransition(() => setActiveElements(next)).finally(() => {
        isTransitioning.current = false;
        if (!pendingRef.current) return;

        const pending = pendingRef.current;
        pendingRef.current = null;

        startTransition(pending);
      });
    }

    let rafId: number;

    const loop = () => {
      const cursor = cursorIndexRef.current;
      const next = getActiveElements(timeline, cursor);
      const nextIds = next.map((e) => e.id);
      if (!sameIds(activeIdsRef.current, nextIds)) {
        activeIdsRef.current = nextIds;

        if (isTransitioning.current)
          pendingRef.current = next; // overwrite pending update (latest wins)
        else startTransition(next);
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [timeline]);

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
