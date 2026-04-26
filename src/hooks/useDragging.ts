import { useEffect, useRef, useState, type RefObject } from "react";

export default function useDragging<T extends HTMLElement>({
  onDragStart,
  onDragUpdate,
  onDragEnd,
}: {
  onDragStart?: (e: MouseEvent, elmRef: RefObject<T | null>) => void;
  onDragUpdate?: (e: MouseEvent, elmRef: RefObject<T | null>) => void;
  onDragEnd?: (e: MouseEvent, elmRef: RefObject<T | null>) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const dragElementRef = useRef<T | null>(null);

  // drag start listeners
  useEffect(() => {
    if (!dragElementRef.current) return;

    const mousedown = (e: MouseEvent) => {
      e.preventDefault();
      setDragging(true);
      if (onDragStart) onDragStart(e, dragElementRef);
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
      if (onDragEnd) onDragEnd(e, dragElementRef);
    };

    document.addEventListener("mouseup", mouseup);
    return () => document.removeEventListener("mouseup", mouseup);
  }, [dragging, onDragEnd]);

  // draging event listeners
  useEffect(() => {
    if (!dragging) return;
    if (!dragElementRef.current) return;
    if (!onDragUpdate) return;

    const update = (e: MouseEvent) => onDragUpdate(e, dragElementRef);

    document.addEventListener("mousemove", update);
    return () => document.removeEventListener("mousemove", update);
  }, [dragging, onDragUpdate]);

  return [dragElementRef, dragging] as const;
}
