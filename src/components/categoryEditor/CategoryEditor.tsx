import { categorySchema, type Category } from "@/schemas/category";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Cancel01Icon,
  TagIcon,
  UndoIcon,
} from "@hugeicons/core-free-icons";
import { useMutation } from "@tanstack/react-query";
import SavedStateBadge from "./SavedStateBadge";

export default function CategoryEditor({
  initialCategory,
}: {
  initialCategory: Category;
}) {
  const [category, setCategory] = useState(initialCategory);
  const { mutate: save, status: savedState } = useMutation({
    mutationFn: async () => {
      await new Promise((res) => setTimeout(res, 3000));
      throw Error();
      return "";
    },
  });

  useEffect(() => {
    new Promise((res) => setTimeout(res, 2000)).then(() => save());
  }, []);

  return (
    <main>
      {/* Saved State */}
      <SavedStateBadge savedState={savedState} />

      <div className="flex gap-4">
        <Input
          value={category.id}
          onChange={(e) =>
            setCategory((prev) => ({ ...prev, id: e.target.value }))
          }
          aria-invalid={!categorySchema.shape.id.safeParse(category.id).success}
        />
        <Button
          size="icon-lg"
          variant="outline"
          onClick={() =>
            setCategory((prev) => ({ ...prev, id: initialCategory.id }))
          }
        >
          <HugeiconsIcon icon={UndoIcon} />
        </Button>
      </div>

      <section className="flex flex-wrap gap-1">
        {category.tags.map((tag) => (
          <Button variant="tag" size="sm" className="group" key={tag}>
            <div className="relative">
              <HugeiconsIcon
                icon={TagIcon}
                className="group-hover:opacity-0 transition-opacity"
              />
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="absolute group-hover:opacity-100 opacity-0 transition-opacity top-0"
              />
            </div>
            {tag}
          </Button>
        ))}
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Add01Icon} />
        </Button>
      </section>
    </main>
  );
}
