import type { ReactNode } from "react";

export default function Timeline({
  children,
  clipCount,
  length,
}: {
  children: ReactNode;
  clipCount: number;
  length: number;
}) {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateRows: `repeat(${clipCount}, 1fr)`,
        gridTemplateColumns: `repeat(${length}, 1fr)`,
      }}
    >
      {Array.from(Array(length - 1)).map((_, index) => (
        <div
          className="w-px bg-zinc-400 h-full -ml-1"
          style={{
            gridRowStart: 1,
            gridRowEnd: clipCount + 1,
            gridColumnStart: index + 2,
          }}
        />
      ))}
      {children}
    </div>
  );
}
