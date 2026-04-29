import { type ReactNode, type RefObject } from "react";

/**
 * Returns "nice" timeline ticks for a given duration.
 *
 * @param durationSec total duration in seconds (max ~300 for your use case)
 * @param maxTicks desired maximum number of ticks (default: 8)
 */
export function getTimelineSteps(durationSec: number, maxTicks: number = 10) {
  // Allowed step sizes in seconds (extendable)
  const steps = [1, 2, 5, 10, 15, 30, 60, 120, 180, 300];

  // Find smallest step that results in <= maxTicks
  let chosenStep = steps[steps.length - 1];

  for (const step of steps) {
    const tickCount = Math.ceil(durationSec / step);
    if (tickCount <= maxTicks) {
      chosenStep = step;
      break;
    }
  }

  // Generate ticks
  const ticks: number[] = [];
  for (let t = 0; t <= durationSec; t += chosenStep) {
    ticks.push(t);
  }

  // Ensure last tick is exactly duration
  if (ticks[ticks.length - 1] !== durationSec) {
    ticks.push(durationSec);
  }

  return {
    step: chosenStep,
    ticks,
  };
}
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
  const { ticks } = getTimelineSteps(length);

  return (
    <div
      ref={ref}
      className="grid py-7 gap-2"
      style={{
        gridTemplateRows: `repeat(${clipCount}, 1fr)`,
        gridTemplateColumns: `repeat(${length}, 1fr)`,
      }}
    >
      {ticks.map((tick, index) => (
        <div
          key={index}
          className="w-px flex justify-center relative bg-zinc-400 h-[calc(100%+10px)] -mt-1.25 -ml-1"
          style={{
            gridRowStart: 1,
            gridRowEnd: clipCount + 1,
            gridColumnStart: tick + 1,
          }}
        >
          <span className="absolute -top-4 text-zinc-400 text-xs">{tick}</span>
        </div>
      ))}
      {children}
    </div>
  );
}
