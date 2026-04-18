import { flushSync } from "react-dom";

export default function withViewTransition(callback: () => void) {
  if (!document.startViewTransition) return callback();
  return document.startViewTransition(() => flushSync(() => callback()));
}
