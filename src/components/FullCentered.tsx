import type { ReactNode } from "react";

export default function FullCentred({ children }: { children: ReactNode }) {
  return <div className="size-full grid place-items-center">{children}</div>;
}
