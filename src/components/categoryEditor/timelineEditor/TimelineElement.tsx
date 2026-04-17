import { useDebouncedControlledState } from "@/hooks/useDebouncedControlledState";
import useDragging from "@/hooks/useDragging";
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

  const [closestCell, setClosestCell] = useState(0);

  const timelineElementRef = useRef<HTMLDivElement | null>(null);

  const getClosestCell = (e: MouseEvent) => {
    if (!timelineElementRef.current) throw Error("timelineElementRef is null");
    const timelineRect =
      timelineElementRef.current.parentElement!.getBoundingClientRect();
    const cellWidth = timelineRect.width / timelineLength;
    return Math.floor(
      (e.clientX - timelineRect.left + cellWidth / 2) / cellWidth + 1,
    );
  };

  const updateClosestCell = (e: MouseEvent) => {
    const newClosestCell = getClosestCell(e);
    if (closestCell !== newClosestCell) setClosestCell(newClosestCell);
    return newClosestCell;
  };

  const [leftGrabberRef, draggingLeft] = useDragging<HTMLDivElement>({
    onDragStart: updateClosestCell,
    onDragUpdate: updateClosestCell,
    onDragEnd: () => {
      setTimelineElement(
        { ...timelineElement, start: closestCell },
        { instantUpdate: true },
      );
    },
  });

  const [rightGrabberRef, draggingRight] = useDragging<HTMLDivElement>({
    onDragStart: updateClosestCell,
    onDragUpdate: updateClosestCell,
    onDragEnd: () => {
      setTimelineElement(
        { ...timelineElement, end: closestCell },
        { instantUpdate: true },
      );
    },
  });

  const [offset, setOffset] = useState({ start: 0, end: 0 });
  const [centerGrabberRef, draggingCenter] = useDragging<HTMLDivElement>({
    onDragStart: (e) => {
      const closestCell = updateClosestCell(e);
      setOffset({
        start: closestCell - timelineElement.start,
        end: timelineElement.end - closestCell,
      });
    },
    onDragUpdate: updateClosestCell,
    onDragEnd: () =>
      setTimelineElement(
        {
          ...timelineElement,
          start: closestCell - offset.start,
          end: closestCell + offset.end,
        },
        { instantUpdate: true },
      ),
  });

  return (
    <div
      ref={timelineElementRef}
      className="border bg-blue-500 rounded px-3 py-1 relative"
      style={{
        gridColumnStart: draggingLeft
          ? closestCell
          : draggingCenter
            ? closestCell - offset.start
            : timelineElement.start,
        gridColumnEnd: draggingRight
          ? closestCell
          : draggingCenter
            ? closestCell + offset.end
            : timelineElement.end,
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
      <div
        ref={centerGrabberRef}
        className="top-0 left-0 mx-2 cursor-grab h-full w-[calc(100%-2*0.5rem)] absolute"
      />

      {timelineElement.type === "text"
        ? timelineElement.content
        : timelineElement.type}
    </div>
  );
}
