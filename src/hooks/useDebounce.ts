import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [debouncing, setDebouncing] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
      setDebouncing(false);
    }, delay);

    setDebouncing(true);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return [debouncedValue, debouncing] as const;
};
