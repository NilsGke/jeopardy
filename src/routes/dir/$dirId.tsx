import ErrorAlert from "@/components/ErrorAlert";
import FullCentered from "@/components/FullCentered";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/indexedDB/db";
import { initNewJFDirectory } from "@/jeopardyFiles/initNewJFDirectory";
import {
  DirectoryState,
  getRootMetaFileAndState,
  type JFRootMeta,
} from "@/jeopardyFiles/rootMeta";
import { Directory } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";

class FileHandlePermissionError extends Error {
  static name = "FileHandlePermissionError";
  handle: FileSystemDirectoryHandle;

  constructor(message: string, handle: FileSystemDirectoryHandle) {
    super(message);
    this.name = FileHandlePermissionError.name;
    this.handle = handle;
  }

  static errorIsFileHandlePermissionError(
    error: Error,
  ): error is FileHandlePermissionError {
    return error.name === FileHandlePermissionError.name;
  }
}

export const Route = createFileRoute("/dir/$dirId")({
  loader: async ({ params }) => {
    const dir = await db.jeopardyDirectories.get(parseInt(params.dirId));
    if (!dir) throw Error("Failed to load directory");
    const perms = await dir.handle.queryPermission();
    if (perms === "prompt")
      throw new FileHandlePermissionError(
        "need to prompt for permission",
        dir.handle,
      );
    if (perms === "denied")
      throw new FileHandlePermissionError("permission denied", dir.handle);
    return { dir };
  },
  errorComponent: ({ error }) => {
    if (FileHandlePermissionError.errorIsFileHandlePermissionError(error))
      return (
        <ErrorAlert
          title="Insuffitient directory permission"
          description="The App needs permission to read / write in the directory"
          action={{
            type: "function",
            text: "Query Permission",
            fnc: () =>
              error.handle
                .requestPermission({ mode: "readwrite" })
                .then(() => window.location.reload()),
          }}
        />
      );

    return (
      <ErrorAlert
        title="Failed to load directory!"
        description="This should not have happened."
        action={{
          type: "link",
          text: "Choose different directory",
          href: "/",
        }}
      />
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { dir } = Route.useLoaderData();

  const [directoryState, setDirectoryState] = useState<DirectoryState | null>(
    null,
  );
  const [rootMetaVersion, setRootMetaVersion] = useState<
    JFRootMeta["version"] | null
  >(null);
  const [rootMeta, setRootMeta] = useState<JFRootMeta | null>(null);

  const getRootMeta = () => {
    getRootMetaFileAndState(dir.handle).then(async (res) => {
      setDirectoryState(res.directoryState);
      if (res.directoryState === DirectoryState.VALID) setRootMeta(res.data);
      if (res.directoryState === DirectoryState.MAJOR_VERSION_MISMATCH)
        setRootMetaVersion(res.dirVersion);
    });
  };

  useEffect(() => getRootMeta(), [dir]);

  if (directoryState === DirectoryState.EMPTY)
    return (
      <FullCentered>
        <Card className="md:min-w-lg min-w-sm ">
          <CardHeader>
            <CardTitle>Initialize new Jeopardy Directory?</CardTitle>
            <CardDescription>The selected directory is empty</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Do you want to initialize a new Jeopardy Directory?
              <br />
              This will create a meta file and initialize some subdirectories{" "}
              <br />
              used to store categories, boards and games.
            </p>
          </CardContent>
          <CardFooter className="flex gap-3 flex-wrap">
            <Button
              onClick={() => initNewJFDirectory(dir.handle).then(getRootMeta)}
            >
              Initialize new Jeopardy Directory
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/">Select different directory</Link>
            </Button>
          </CardFooter>
        </Card>
      </FullCentered>
    );

  if (directoryState === DirectoryState.NONEMPTY_BUT_NO_META)
    return (
      <FullCentered>
        <Card className="md:min-w-lg min-w-sm ">
          <CardHeader>
            <CardTitle>Invalid Jeopardy Directory</CardTitle>
            <CardDescription>
              The selected directory is not empty but is also not a jeopardy
              directory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Please clear the directory from any files or select a different
              one
            </p>
          </CardContent>
          <CardFooter className="flex gap-3 flex-wrap">
            <Button asChild>
              <Link to="/">Select different directory</Link>
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </CardFooter>
        </Card>
      </FullCentered>
    );

  if (directoryState === DirectoryState.INVALID_META)
    return (
      <FullCentered>
        <Card className="md:min-w-lg min-w-sm ">
          <CardHeader>
            <CardTitle>Invalid Jeopardy Meta File</CardTitle>
            <CardDescription>
              The Meta file in this directory is invalid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Please resolve any issues with your meta file or select a
              different jeopardy directory
            </p>
          </CardContent>
          <CardFooter className="flex gap-3 flex-wrap">
            <Button asChild>
              <Link to="/">Select different directory</Link>
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </CardFooter>
        </Card>
      </FullCentered>
    );

  if (directoryState === DirectoryState.MAJOR_VERSION_MISMATCH)
    return (
      <FullCentered>
        <Card className="md:min-w-lg min-w-sm ">
          <CardHeader>
            <CardTitle>Newer Version available</CardTitle>
            <CardDescription>
              The Directory you selected uses a older version of this app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Do you want to upgrade your directory now or use a older version
              of the app?
            </p>
          </CardContent>
          <CardFooter className="flex gap-3 flex-wrap">
            <Button
              // TODO: implement upgrade
              onClick={() => alert("not implemented yet")}
            >
              Upgrade
            </Button>
            <Button variant="secondary" asChild>
              <a
                href={`https://v${rootMetaVersion?.major}.${import.meta.env.VITE_PROD_DOMAIN}`}
              >
                Use old app version (v{rootMetaVersion?.major})
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/">Select different directory</Link>
            </Button>
          </CardFooter>
        </Card>
      </FullCentered>
    );

  if (directoryState === null || directoryState === DirectoryState.VALID)
    return (
      <>
        <header>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <HugeiconsIcon size={16} icon={Directory} />
                    {dir.handle.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {directoryState === null && (
          <FullCentered>
            <p className="text-zinc-400 animate-pulse">Loading...</p>
          </FullCentered>
        )}

        {directoryState !== null && <Outlet />}
      </>
    );

  // exhaustive check
  const leftoverState: never = directoryState;
  throw new Error("unhandled case" + leftoverState);
}
