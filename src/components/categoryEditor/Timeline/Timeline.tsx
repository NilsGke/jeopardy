import useDragging from "@/hooks/useDragging";
import { cn } from "@/lib/utils";
import { useRef, useState, type ReactNode } from "react";

export default function Timeline({
  children,
  clipCount,
  length,
}: {
  children: ReactNode;
  clipCount: number;
  length: number;
}) {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [cursorIndex, setCursorIndex] = useState(2);
  const [cursorRef, isDraggingCursor] = useDragging<HTMLDivElement>({
    onDragUpdate: (e) => {
      if (!timelineRef.current) return;
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const cellWidth = timelineRect.width / length;
      const cursorPos = Math.floor(
        (e.clientX - timelineRect.left) / cellWidth + 1,
      );
      setCursorIndex(cursorPos);
    },
  });

  return (
    <div
      ref={timelineRef}
      className="grid py-7 gap-2"
      style={{
        gridTemplateRows: `repeat(${clipCount}, 1fr)`,
        gridTemplateColumns: `repeat(${length}, 1fr)`,
      }}
    >
      <div
        ref={cursorRef}
        className="z-10 h-full w-5 flex justify-center items-center justify-self-center group row-start-1 cursor-grab"
        style={{ gridRowEnd: clipCount + 1, gridColumnStart: cursorIndex }}
      >
        <div
          className={cn(
            "w-0.75 bg-amber-500 h-[calc(100%+30px)] rounded mx-auto group-hover:w-1.25 transition-all duration-100",
            isDraggingCursor && "w-1.75!",
          )}
        />
      </div>

      {Array.from(Array(length - 1)).map((_, index) => (
        <div
          key={index}
          className="w-px flex justify-center relative bg-zinc-400 h-[calc(100%+10px)] -mt-1.25 -ml-1"
          style={{
            gridRowStart: 1,
            gridRowEnd: clipCount + 1,
            gridColumnStart: index + 2,
          }}
        >
          <span className="absolute -top-4 text-zinc-400 text-xs">
            {index + 1}
          </span>
        </div>
      ))}
      {children}
    </div>
  );
}
