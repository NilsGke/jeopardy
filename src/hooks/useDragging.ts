import { useEffect, useRef, useState } from "react";

export default function useDragging<T extends HTMLElement>({
  onDragStart,
  onDragUpdate,
  onDragEnd,
}: {
  onDragStart?: (e: MouseEvent) => void;
  onDragUpdate?: (e: MouseEvent) => void;
  onDragEnd?: (e: MouseEvent) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const dragElementRef = useRef<T | null>(null);

  // drag start listeners
  useEffect(() => {
    if (!dragElementRef.current) return;

    const mousedown = (e: MouseEvent) => {
      e.preventDefault();
      setDragging(true);
      if (onDragStart) onDragStart(e);
    };

    dragElementRef.current.addEventListener("mousedown", mousedown);
    return () => {
      if (!dragElementRef.current) return;
      dragElementRef.current.addEventListener("mousedown", mousedown);
    };
  }, [onDragStart]);

  // drag stop event listeners
  useEffect(() => {
    if (!dragging) return;
    if (!dragElementRef.current) return;

    const mouseup = (e: MouseEvent) => {
      setDragging(false);
      if (onDragEnd) onDragEnd(e);
    };

    document.addEventListener("mouseup", mouseup);
    return () => document.removeEventListener("mouseup", mouseup);
  }, [dragging, onDragEnd]);

  // draging event listeners
  useEffect(() => {
    if (!dragging) return;
    if (!dragElementRef.current) return;
    if (!onDragUpdate) return;

    document.addEventListener("mousemove", onDragUpdate);
    return () => document.removeEventListener("mousemove", onDragUpdate);
  }, [dragging, onDragUpdate]);

  return [dragElementRef, dragging] as const;
}
