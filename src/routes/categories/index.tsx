import { CategoriesTable } from "@/components/categoryTable/CategoriesTable";
import { columns } from "@/components/categoryTable/columns";
import Section from "@/components/categoryTable/Section";
import ErrorAlert from "@/components/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { getAllCategoryIds, getCategory } from "@/filesystem/category";
import { cn } from "@/lib/utils";
import { useRootDir } from "@/providers/RootProvider";
import type { Category } from "@/schemas/category";
import {
  Add01Icon,
  Cancel01Icon,
  TagIcon,
  UndoIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const rootDir = useRootDir();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!rootDir) throw Error("Root dir is null");
      const ids = await getAllCategoryIds(rootDir);
      const categories = await Promise.allSettled(
        ids.map((id) => getCategory(id, rootDir)),
      );
      const validCategories: Category[] = [];
      const invalidCategories: any[] = [];
      categories.forEach((promise) => {
        if (promise.status === "fulfilled") validCategories.push(promise.value);
        else invalidCategories.push(promise.reason);
      });

      if (invalidCategories.length > 0) {
        console.error("invalid categories:");
        invalidCategories.forEach((error) => console.error(error));
      }

      const tags = new Set<string>();
      validCategories.forEach((category) =>
        category.tags.forEach((tag) => tags.add(tag)),
      );

      return {
        validCategories: validCategories.sort((a, b) =>
          a.id.localeCompare(b.id, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        ),
        invalidCategories,
        tags: [...tags.keys()].sort(),
      };
    },
  });

  if (!data) return "loading...";

  return (
    <Section>
      <div
        className={cn(
          "max-h-[95dvh] grid xl:grid-cols-[auto_1fr] grid-cols-1 xl:grid-rows-1 grid-rows-[auto_1fr] gap-8",
        )}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl text-center">Categories</h1>

          <Input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <h2 className="text-lg space-x-2">
            <HugeiconsIcon icon={TagIcon} className="inline" size={20} />
            <span>Tags:</span>
          </h2>
          <div className="flex gap-2 flex-wrap ">
            {data.tags.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <Toggle
                  size="sm"
                  variant="tag"
                  className="aria-pressed:bg-primary aria-pressed:text-white cursor-pointer group"
                  key={tag}
                  pressed={selectedTags.includes(tag)}
                  onPressedChange={(selected) =>
                    setSelectedTags((prev) =>
                      selected ? [...prev, tag] : prev.filter((t) => t !== tag),
                    )
                  }
                >
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Add01Icon}
                      className={cn(
                        "transition-opacity",
                        selected ? "opacity-0" : "opacity-100",
                      )}
                    />
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      className={cn(
                        "absolute top-0 transition-opacity",
                        selected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                  {tag}
                </Toggle>
              );
            })}
            {selectedTags.length > 0 && (
              <Button variant="outline" onClick={() => setSelectedTags([])}>
                <HugeiconsIcon icon={UndoIcon} />
                reset
              </Button>
            )}
          </div>

          {data.invalidCategories.length > 0 && (
            <ErrorAlert
              className="mt-auto"
              title={`${data.invalidCategories.length} invalid Categories`}
              description={`${data.invalidCategories.length} categories have a invalid meta file. Please fix!`}
              action={{
                type: "function",
                text: "Fix",
                // TODO: implement category file fixing
                fnc: () => alert("not implemented yet"),
              }}
            />
          )}
        </div>

        <CategoriesTable
          data={data.validCategories}
          columns={columns}
          searchTerm={searchTerm}
          selectedTags={selectedTags}
          refreshRows={refetch}
        />
      </div>
    </Section>
  );
}
