import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Badge } from "../ui/badge";
import {
  Alert01Icon,
  Download01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import type { MutationObserverResult } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type MutationState = MutationObserverResult["status"];

export default function SavedStateBadge({
  savedState,
  className,
}: {
  savedState: MutationState;
  className?: string;
}) {
  const icon = (
    {
      success: Tick01Icon,
      pending: Download01Icon,
      idle: Tick01Icon,
      error: Alert01Icon,
    } satisfies Record<MutationState, IconSvgElement>
  )[savedState];

  const text = {
    success: "Saved",
    pending: "Saving...",
    idle: "Unchanged",
    error: "Error!",
  }[savedState];

  const styles = {
    success: "bg-green-600 text-green-50",
    pending: "bg-yellow-400 text-yellow-950 *:animate-pulse",
    idle: "bg-green-600 text-green-50",
    error: "bg-red-500 text-white",
  }[savedState];

  return (
    <Badge
      variant={savedState === "success" ? "success" : "warning"}
      className={cn(styles, className)}
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} />
      <span>{text}</span>
    </Badge>
  );
}
