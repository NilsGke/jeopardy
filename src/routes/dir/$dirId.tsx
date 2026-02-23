import ErrorAlert from "@/components/ErrorAlert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { db } from "@/indexedDB/db";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dir/$dirId")({
  loader: async ({ params }) => {
    const dir = await db.jeopardyDirectories.get(parseInt(params.dirId));
    if (!dir) throw Error("Failed to load directory");
    return { dir };
  },
  errorComponent: () => (
    <ErrorAlert
      title="Failed to load directory!"
      description="This should not have happened."
      action={{
        text: "Choose different directory",
        href: "/",
      }}
    />
  ),
  component: RouteComponent,
});

function RouteComponent() {
  const { dir } = Route.useLoaderData();

  return (
    <>
      <header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">{dir.handle.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <Outlet />
    </>
  );
}
