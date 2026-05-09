import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";

export type SameLength<A extends readonly unknown[], T> = {
  [K in keyof A]: T;
};

const checks = [
  {
    title: "Make a full backup of your jeopardy directory.",
    description:
      "I understand that updating the jeopardy directory might break / erase it if something goes wrong",
  },
  {
    title: "Do not close the browser tab!",
    description:
      "I understand that closing the browser tab during the update will break my jeopardy direcotry",
  },
  {
    title: "The update might take some time.",
    description:
      "I understand that the update might take a few mintes depending on the amount of categories you have in your jepardy directory.",
  },
] as const satisfies { title: string; description: string }[];

export default function MigrationDialogForm({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [checkState, setCheckState] = useState<
    SameLength<typeof checks, boolean>
  >([false, false, false]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="px-10">
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {checks.map(({ title, description }, index) => (
              <CarouselItem key={index}>
                <FieldLabel>
                  <Field
                    orientation="horizontal"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Checkbox
                      name="toggle-checkbox-2"
                      className="mt-1.5!"
                      value={checkState[index] ? "checked" : "unchecked"}
                      onCheckedChange={(checked) =>
                        checked !== "indeterminate" &&
                        setCheckState(
                          (prev) =>
                            prev.with(index, checked) as SameLength<
                              typeof checks,
                              boolean
                            >,
                        )
                      }
                    />
                    <FieldContent>
                      <FieldTitle className="w-full text-lg justify-between">
                        <p>{title}</p>
                        <span className=" text-nowrap">
                          {index + 1} / {checks.length}
                        </span>
                      </FieldTitle>
                      <FieldDescription className="text-white/80">
                        {description}{" "}
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <Button
        className="w-full"
        disabled={checkState.some((check) => !check)}
        variant="secondary"
        onClick={onComplete}
      >
        Start Upgrade
      </Button>
    </div>
  );
}
