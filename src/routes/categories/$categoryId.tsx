import CategoryEditor from "@/components/categoryEditor/CategoryEditor";
import FullCentered from "@/components/FullCentered";
import { getCategory, getCategoryDirectory } from "@/filesystem/category";
import { useRootDir } from "@/providers/RootProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/$categoryId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { categoryId } = Route.useParams();
  const rootDir = useRootDir();

  const { data: category } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => {
      if (!rootDir) return;
      return getCategory(categoryId, rootDir);
    },
  });
  if (!category)
    return <FullCentered>Loading category {categoryId}</FullCentered>;

  return <CategoryEditor initialCategory={category} />;
}
