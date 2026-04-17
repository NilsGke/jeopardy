import { useState, useEffect, useRef, useCallback } from "react";

type Options<T> = {
  delay?: number;
  onCommit: (value: T) => void;
};

export function useDebouncedControlledState<T>(
  externalValue: T,
  options: Options<T>,
) {
  const { delay = 100, onCommit } = options;

  const [localValue, setLocalValue] = useState(externalValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEditingRef = useRef(false);

  // keep local state in sync with parent (only when not editing)
  useEffect(() => {
    if (!isEditingRef.current) {
      setLocalValue(externalValue);
    }
  }, [externalValue]);

  const defaultOptions = { instantUpdate: false };
  const setValue = useCallback(
    (value: T, options?: Partial<typeof defaultOptions>) => {
      const { instantUpdate = defaultOptions.instantUpdate } =
        options || defaultOptions;

      setLocalValue(value);

      if (instantUpdate) return onCommit(value);

      isEditingRef.current = true;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        isEditingRef.current = false;
        onCommit(value);
      }, delay);
    },
    [delay, onCommit],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return [localValue, setValue] as const;
}
