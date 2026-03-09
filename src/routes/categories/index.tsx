import { CategoriesTable } from "@/components/categoryTable/CategoriesTable";
import { columns } from "@/components/categoryTable/columns";
import Section from "@/components/categoryTable/Section";
import ErrorAlert from "@/components/ErrorAlert";
import { Input } from "@/components/ui/input";
import { getAllCategoryIds, getCategory } from "@/filesystem/category";
import { cn } from "@/lib/utils";
import { useRootDir } from "@/providers/RootProvider";
import type { Category } from "@/schemas/category";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const rootDir = useRootDir();

  const { data } = useQuery({
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
        invalidCategories.forEach((category) => console.error(category));
      }

      return {
        validCategories: validCategories.sort((a, b) =>
          a.id.localeCompare(b.id, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        ),
        invalidCategories,
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

          <Input type="search" placeholder="Search..." />

          {data.invalidCategories.length > -1 && (
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

        <CategoriesTable data={data.validCategories} columns={columns} />
      </div>
    </Section>
  );
}
