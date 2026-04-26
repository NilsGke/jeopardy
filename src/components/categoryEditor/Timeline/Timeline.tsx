import { type ReactNode, type RefObject } from "react";

export default function Timeline({
  children,
  clipCount,
  length,
  ref,
}: {
  children: ReactNode;
  clipCount: number;
  length: number;
  ref: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={ref}
      className="grid py-7 gap-2"
      style={{
        gridTemplateRows: `repeat(${clipCount}, 1fr)`,
        gridTemplateColumns: `repeat(${length}, 1fr)`,
      }}
    >
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
