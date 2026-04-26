import type { GameFieldType } from "@/schemas/gameField";
import { useRef, useState } from "react";
import Timeline from "./Timeline/Timeline";
import TimelineElement from "./Timeline/TimelineElement";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import withViewTransition from "@/util/withViewTransition";
import TimelineRenderer from "./Timeline/TimelineRenderer";
import TimelineCursor from "./Timeline/TimelineCursor";

export default function GamefieldEditor({
  gameField,
  setGameField,
}: {
  gameField: GameFieldType;
  setGameField: (newCategory: GameFieldType) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cursorIndexRef = useRef(1);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const timelineLength = gameField.timeline.reduce(
    (biggest, curr) => (curr.end > biggest ? curr.end : biggest),
    0,
  );

  return (
    <div
      className="grid grid-cols-[auto_1fr_auto] gap-8 border rounded-3xl p-4"
      style={{
        viewTransitionName: `gamefield-editor-${gameField.id}`,
      }}
    >
      <Label className="flex-col">
        <p className="">Points</p>
        <Input
          type="number"
          value={gameField.points}
          className="w-16 text-center number-input-no-spin"
          onChange={(e) =>
            !isNaN(parseInt(e.target.value)) &&
            setGameField({ ...gameField, points: parseInt(e.target.value) })
          }
        />
      </Label>

      {!expanded && (
        <div className="flex gap-4">
          {gameField.timeline
            .sort((a, b) =>
              a.start === b.start ? a.end - b.end : a.start - b.start,
            )
            .map((timelineElement) => (
              <div
                key={timelineElement.id}
                className="h-full flex justify-center items-center border rounded-md bg-zinc-100 p-2"
                style={{
                  viewTransitionName: `timeline-element-${timelineElement.id}`,
                }}
              >
                {timelineElement.type === "text" ? (
                  <p
                    style={{
                      viewTransitionName: `timeline-element-text-${timelineElement.id}`,
                    }}
                  >
                    {timelineElement.content}
                  </p>
                ) : (
                  timelineElement.type
                )}
              </div>
            ))}
        </div>
      )}

      {expanded && (
        <div>
          <TimelineRenderer
            timeline={gameField.timeline}
            cursorIndexRef={cursorIndexRef}
            className="h-[40vh]"
          />

          <Timeline
            ref={timelineRef}
            clipCount={gameField.timeline.length}
            length={timelineLength}
          >
            <TimelineCursor
              cursorIndexRef={cursorIndexRef}
              timelineRef={timelineRef}
              clipCount={gameField.timeline.length}
              timelineLength={timelineLength}
            />

            {gameField.timeline.map((timelineElement, timelineElementIndex) => (
              <TimelineElement
                key={timelineElement.id}
                index={timelineElementIndex}
                timelineLength={timelineLength}
                timelineElement={timelineElement}
                setTimelineElement={(newTimelineElement) =>
                  setGameField({
                    ...gameField,
                    timeline: gameField.timeline.with(
                      timelineElementIndex,
                      newTimelineElement,
                    ),
                  })
                }
              />
            ))}
          </Timeline>
        </div>
      )}

      <Button
        variant="secondary"
        onClick={() => withViewTransition(() => setExpanded((prev) => !prev))}
      >
        Edit
      </Button>
    </div>
  );
}
