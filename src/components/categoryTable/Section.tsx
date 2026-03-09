import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("*:mx-auto *:max-w-7xl", className)}>{children}</div>
  );
}
