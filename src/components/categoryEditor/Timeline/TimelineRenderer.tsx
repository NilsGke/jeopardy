import type { TimelineElement } from "@/schemas/gameField";
import TimelineElementRenderer from "./TimelineElementRenderer";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import withViewTransition from "@/util/withViewTransition";

export default function TimelineRenderer({
  elements: externalElements,
  className,
}: {
  elements: TimelineElement[];
  className?: string;
}) {
  const [elements, setElements] = useState(externalElements);
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    withViewTransition(() => setElements(externalElements));
  }, [externalElements]);

  return (
    <div
      className={cn(
        "flex justify-center items-center gap-[5%] rounded-2xl border p-4 aspect-video",
        className,
      )}
    >
      {elements.map((element) => (
        <TimelineElementRenderer key={element.id} element={element} />
      ))}
    </div>
  );
}
