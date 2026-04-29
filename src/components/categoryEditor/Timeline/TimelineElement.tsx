import { Button } from "@/components/ui/button";
import { useDebouncedControlledState } from "@/hooks/useDebouncedControlledState";
import useDragging from "@/hooks/useDragging";
import { cn } from "@/lib/utils";
import { type TimelineElementType } from "@/schemas/gameField";
import { CancelCircleIcon, Edit03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";

export default function TimelineElement({
  index,
  timelineLength,
  timelineElement: externalTimelineElement,
  setTimelineElement: setExternalTimelineElement,
}: {
  index: number;
  timelineLength: number;
  timelineElement: TimelineElementType;
  setTimelineElement: (newElm: TimelineElementType) => void;
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
      className={cn(
        "text-white border bg-linear-to-r via-blue-500 from-blue-500 transition-colors to-blue-500 rounded px-3 py-1 relative h-13",
        {
          "from-blue-600": draggingLeft,
          "to-blue-600": draggingRight,
          "via-blue-600": draggingCenter,
        },
      )}
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
        viewTransitionName: `timeline-element-${timelineElement.id}`,
      }}
    >
      <div
        ref={leftGrabberRef}
        className="top-0 -left-3 cursor-ew-resize h-full w-6 absolute"
      />
      <div
        ref={rightGrabberRef}
        className="top-0 -right-3 cursor-ew-resize h-full w-6 absolute"
      />
      <div
        ref={centerGrabberRef}
        className="top-0 left-0 mx-2 cursor-grab h-full w-[calc(100%-2*0.5rem)] absolute"
      />

      <div className="flex justify-between items-center">
        {timelineElement.type === "text" ? (
          <p
            className="w-fit justify-self-start"
            style={{
              viewTransitionName: `timeline-element-text-${timelineElement.id}`,
            }}
          >
            {timelineElement.content}
          </p>
        ) : (
          timelineElement.type
        )}

        <div className=" ml-auto z-20 *:bg-transparent *:border-none *:*:*:stroke-2">
          <Button variant="outline" size="icon-lg">
            <HugeiconsIcon icon={Edit03Icon} />
          </Button>
          <Button variant="outline" size="icon-lg">
            <HugeiconsIcon icon={CancelCircleIcon} />
          </Button>
        </div>
      </div>
    </div>
  );
}
