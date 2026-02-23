import { createFileRoute, getRouteApi } from "@tanstack/react-router";

export const Route = createFileRoute("/dir/$dirId/")({
  component: RouteComponent,
});

const routeApi = getRouteApi("/dir/$dirId");

function RouteComponent() {
  const { dir } = routeApi.useLoaderData();
  if (!dir) throw Error("dir not loaded");

  return <div className="flex flex-col gap-2">Categories</div>;
}
