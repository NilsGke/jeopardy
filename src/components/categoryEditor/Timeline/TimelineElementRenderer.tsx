import type { TimelineElementType } from "@/schemas/gameField";
import type { ReactNode } from "react";

export default function TimelineElementRenderer({
  element,
}: {
  element: TimelineElementType;
}) {
  const Wrapper = ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div
      className={className}
      style={{ viewTransitionName: `timeline-element-rendered-${element.id}` }}
    >
      {children}
    </div>
  );

  switch (element.type) {
    case "text":
      return <Wrapper className="text-4xl">{element.content}</Wrapper>;
    case "image":
      return <Wrapper>{element.type}</Wrapper>;
    case "sound":
      return <Wrapper>{element.type}</Wrapper>;
    case "video":
      return <Wrapper>{element.type}</Wrapper>;

    default:
      const exhaustiveCheck: never = element;
      throw new Error(`unchecked element type: ${exhaustiveCheck}`);
  }
}
