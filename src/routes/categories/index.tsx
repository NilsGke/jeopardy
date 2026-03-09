import { CategoriesTable } from "@/components/categoryTable/CategoriesTable";
import { columns } from "@/components/categoryTable/columns";
import ErrorAlert from "@/components/ErrorAlert";
import { getAllCategoryIds, getCategory } from "@/filesystem/category";
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

      return { validCategories, invalidCategories };
    },
  });

  if (!data) return "loading...";

  return (
    <div>
      {data.invalidCategories.length > 0 && (
        <div className="mb-4">
          <ErrorAlert
            title={`${data.invalidCategories.length} invalid Categories`}
            description={`${data.invalidCategories.length} categories have a invalid meta file. Please fix!`}
            action={{
              type: "function",
              text: "Fix",
              // TODO: implement category file fixing
              fnc: () => alert("not implemented yet"),
            }}
          />
        </div>
      )}
      <CategoriesTable data={data.validCategories} columns={columns} />
    </div>
  );
}
