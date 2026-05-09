import type { MigrationStatusUpdate } from "@/filesystem/migrations";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";
import { useEffect, useRef } from "react";

export default function MigrationDialogInfoPanel({
  updates,
}: {
  updates: MigrationStatusUpdate[];
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const completionPercentage = updates.at(-1)?.completion || 0;

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
    });
  }, [updates]);

  return (
    <div className="space-y-4">
      <ScrollArea className="h-50 flex flex-col gap-4 w-full rounded-md border p-4">
        {updates.map(({ message }, index) => (
          <p key={index}>{message}</p>
        ))}

        <div ref={bottomRef} />
      </ScrollArea>

      <Progress
        value={completionPercentage * 100}
        className="[--primary:white] bg-red-400"
      />
    </div>
  );
}
