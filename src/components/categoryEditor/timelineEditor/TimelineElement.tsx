import { useDebouncedControlledState } from "@/hooks/useDebouncedControlledState";
import { type TimelineElement } from "@/schemas/gameField";
import { useEffect, useRef, useState } from "react";

export default function TimelineElement({
  index,
  timelineLength,
  timelineElement: externalTimelineElement,
  setTimelineElement: setExternalTimelineElement,
}: {
  index: number;
  timelineLength: number;
  timelineElement: TimelineElement;
  setTimelineElement: (newElm: TimelineElement) => void;
}) {
  const [timelineElement, setTimelineElement] = useDebouncedControlledState(
    externalTimelineElement,
    {
      onCommit: (data) => setExternalTimelineElement(data),
      delay: 1000,
    },
  );

  const [dragging, setDragging] = useState<"left" | "right" | null>(null);
  const [closestCell, setClosestCell] = useState(0);

  const timelineElementRef = useRef<HTMLDivElement | null>(null);
  const leftGrabberRef = useRef<HTMLDivElement | null>(null);
  const rightGrabberRef = useRef<HTMLDivElement | null>(null);

  const updateClosestCell = (e: MouseEvent) => {
    if (!timelineElementRef.current) return;
    const timelineRect =
      timelineElementRef.current.parentElement!.getBoundingClientRect();
    const cellWidth = timelineRect.width / timelineLength;
    const _closestCell = Math.floor(
      (e.clientX - timelineRect.left + cellWidth / 2) / cellWidth + 1,
    );
    if (closestCell !== _closestCell) setClosestCell(_closestCell);
  };

  // drag start listeners
  useEffect(() => {
    if (!leftGrabberRef.current) return;
    if (!rightGrabberRef.current) return;

    const leftmousedown = (e: MouseEvent) => {
      e.preventDefault();
      updateClosestCell(e);
      setDragging("left");
    };
    const rightmousedown = (e: MouseEvent) => {
      e.preventDefault();
      updateClosestCell(e);
      setDragging("right");
    };

    leftGrabberRef.current.addEventListener("mousedown", leftmousedown);
    rightGrabberRef.current.addEventListener("mousedown", rightmousedown);

    return () => {
      if (!leftGrabberRef.current) return;
      if (!rightGrabberRef.current) return;
      leftGrabberRef.current.addEventListener("mousedown", leftmousedown);
      rightGrabberRef.current.addEventListener("mousedown", rightmousedown);
    };
  }, [timelineLength, closestCell]);

  // drag stop event listeners
  useEffect(() => {
    if (!dragging) return;
    if (!leftGrabberRef.current) return;
    if (!rightGrabberRef.current) return;

    const mouseup = () => {
      setTimelineElement(
        {
          ...timelineElement,
          start: dragging === "left" ? closestCell : timelineElement.start,
          end: dragging === "right" ? closestCell : timelineElement.end,
        },
        { instantUpdate: true },
      );
      setDragging(null);
    };

    document.addEventListener("mouseup", mouseup);

    return () => document.removeEventListener("mouseup", mouseup);
  }, [dragging, timelineElement, closestCell]);

  // draging event listeners
  useEffect(() => {
    if (!dragging) return;
    if (!leftGrabberRef.current) return;
    if (!rightGrabberRef.current) return;

    document.addEventListener("mousemove", updateClosestCell);
    return () => document.removeEventListener("mousemove", updateClosestCell);
  }, [dragging, closestCell, timelineLength, updateClosestCell]);

  return (
    <div
      ref={timelineElementRef}
      className="border bg-blue-500 rounded px-3 py-1 relative"
      style={{
        gridColumnStart:
          dragging === "left" ? closestCell : timelineElement.start,
        gridColumnEnd: dragging === "right" ? closestCell : timelineElement.end,
        gridRowStart: index + 1,
        viewTransitionName: `timeline-element-${index}`,
      }}
    >
      <div
        ref={leftGrabberRef}
        className="top-0 -left-2 cursor-ew-resize h-full w-4 absolute"
      />
      <div
        ref={rightGrabberRef}
        className="top-0 -right-2 cursor-ew-resize h-full w-4 absolute"
      />

      {timelineElement.type === "text"
        ? timelineElement.content
        : timelineElement.type}
    </div>
  );
}
