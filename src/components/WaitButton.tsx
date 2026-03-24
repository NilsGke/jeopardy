import { useCallback, type ComponentProps, type ReactNode } from "react";
import { Button } from "./ui/button";

type Props = ComponentProps<typeof Button> & {
  callback: () => void;
  idleText: string;
  readyText: string;
};

export default function WaitButton({
  callback,
  idleText,
  readyText,
  ...attrs
}: Props) {
  const buttonRef = (button: HTMLButtonElement | null) => {
    if (!button) return;

    const WAITING_PERIOD = 2000;
    const UPDATE_FREQ = 100;
    let interval: NodeJS.Timeout | null = null;
    let remaining = Infinity;

    const updateTime = () => {
      remaining -= UPDATE_FREQ;
      button.textContent = `Wait ${Math.ceil(remaining / 1000)}s`;

      if (remaining > 0) return;
      if (interval !== null) clearInterval(interval);
      button.textContent = readyText;
      button.classList.add("ready");
      button.addEventListener("click", callback);
    };

    const mouseEnter = () => {
      remaining = WAITING_PERIOD + UPDATE_FREQ;
      updateTime();
      interval = setInterval(updateTime, UPDATE_FREQ);
    };
    const mouseLeave = () => {
      if (interval !== null) clearInterval(interval);
      button.textContent = "Delete";
      button.classList.remove("ready");
    };

    button.addEventListener("mouseenter", mouseEnter);
    button.addEventListener("focusin", mouseEnter);

    button.addEventListener("mouseleave", mouseLeave);
    button.addEventListener("focusout", mouseLeave);

    return () => {
      button.removeEventListener("mouseenter", mouseEnter);
      button.removeEventListener("focusin", mouseEnter);

      button.removeEventListener("mouseleave", mouseLeave);
      button.removeEventListener("focusout", mouseLeave);

      button.removeEventListener("click", callback);
    };
  };

  return (
    <Button ref={buttonRef} {...attrs}>
      {idleText}
    </Button>
  );
}
