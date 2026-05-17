import { getAllGames } from "@/filesystem/game";
import { useRootDir } from "@/providers/RootProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/games/")({
  component: RouteComponent,
});

function RouteComponent() {
  const rootDir = useRootDir();

  const { data } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      if (rootDir === null) throw Error("root dir is null");
      return await getAllGames(rootDir);
    },
    throwOnError: true,
    retry: 0,
  });

  return (
    <div className="flex flex-col gap-2">
      {data?.length}
      {data?.map((game) => (
        <div>{game.id}</div>
      ))}
    </div>
  );
}
