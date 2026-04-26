import useDragging from "@/hooks/useDragging";
import { cn } from "@/lib/utils";
import { type RefObject } from "react";

export default function TimelineCursor({
  cursorIndexRef,
  timelineRef,
  clipCount,
  timelineLength,
}: {
  cursorIndexRef: RefObject<number>;
  clipCount: number;
  timelineRef: RefObject<HTMLDivElement | null>;
  timelineLength: number;
}) {
  const [dragRef, isDragging] = useDragging<HTMLDivElement>({
    onDragUpdate: (e, cursorElmRef) => {
      if (!timelineRef.current || !cursorElmRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const cellWidth = timelineRect.width / timelineLength;

      let cursorPos = Math.floor(
        (e.clientX - timelineRect.left) / cellWidth + 1,
      );

      cursorPos = Math.max(1, Math.min(timelineLength, cursorPos));

      cursorIndexRef.current = cursorPos;
      cursorElmRef.current.style.gridColumnStart = String(cursorPos);
    },
  });

  return (
    <div
      ref={dragRef}
      className="z-10 h-full w-5 flex justify-center items-center justify-self-center group row-start-1 cursor-grab"
      style={{
        gridRowEnd: clipCount + 1,
        gridColumnStart: cursorIndexRef.current ?? 1,
      }}
    >
      <div
        className={cn(
          "w-0.75 bg-amber-500 h-[calc(100%+30px)] rounded mx-auto group-hover:w-1.25 transition-all duration-100",
          isDragging && "w-1.75!",
        )}
      />
    </div>
  );
}
