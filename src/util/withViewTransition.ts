import { flushSync } from "react-dom";

let transition: ViewTransition | null = null;

export default async function withViewTransition(callback: () => void) {
  if (!document.startViewTransition) return Promise.resolve(callback());
  if (transition) transition.skipTransition();
  transition = document.startViewTransition(() => flushSync(() => callback()));
  transition.finished.then(() => (transition = null));
  return transition.finished;
}
