import { createContext, useContext, useEffect, useState } from "react";
import { assertPermissions } from "@/filesystem/utils";
import { deleteSetting, getSetting } from "@/db/settings";
import {
  DirectoryState,
  getRootMetaFileAndState,
  type JFRootMeta,
} from "@/filesystem/rootMetaFile";
import FullCentered from "@/components/FullCentered";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { initNewJFDirectory } from "@/filesystem/initNewJFDirectory";
import { Link } from "@tanstack/react-router";
import JeopardyDirectoryChooser from "@/components/JeopardyDirectoryChooser";

const RootContext = createContext<FileSystemDirectoryHandle | null>(null);

export function RootProvider({ children }: { children: React.ReactNode }) {
  const [rootDir, setRootDir] = useState<FileSystemDirectoryHandle | null>(
    null,
  );

  const [directoryState, setDirectoryState] = useState<DirectoryState | null>(
    null,
  );
  const [rootMetaVersion, setRootMetaVersion] = useState<
    JFRootMeta["version"] | null
  >(null);
  const [rootMeta, setRootMeta] = useState<JFRootMeta | null>(null);
  const [loadingRootDir, setLoadingRootDir] = useState(true);

  async function init() {
    const handle = await getSetting("rootDir");
    setLoadingRootDir(false);
    if (!handle) return;

    const permission = await handle.queryPermission({ mode: "readwrite" });
    if (permission === "granted") setRootDir(handle);
    else
      await assertPermissions(handle, "readwrite").then(() =>
        setRootDir(handle),
      );
  }
  useEffect(() => void init(), []);

  const getRootMeta = () => {
    if (!rootDir) return;
    getRootMetaFileAndState(rootDir).then(async (res) => {
      setDirectoryState(res.directoryState);
      if (res.directoryState === DirectoryState.VALID) setRootMeta(res.data);
      else if (
        res.directoryState === DirectoryState.MAJOR_VERSION_TOO_OLD ||
        res.directoryState === DirectoryState.MAJOR_VERSION_TOO_NEW
      )
        setRootMetaVersion(res.dirVersion);
    });
  };

  useEffect(() => getRootMeta(), [rootDir]);

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
              onClick={() =>
                rootDir && initNewJFDirectory(rootDir).then(getRootMeta)
              }
            >
              Initialize new Jeopardy Directory
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                deleteSetting("rootDir").then(() => window.location.reload())
              }
            >
              Select different directory
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
            <Button
              variant="secondary"
              onClick={() =>
                deleteSetting("rootDir").then(() => window.location.reload())
              }
            >
              Select different directory
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
            <Button
              variant="secondary"
              onClick={() =>
                deleteSetting("rootDir").then(() => window.location.reload())
              }
            >
              Select different directory
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

  if (directoryState === DirectoryState.MAJOR_VERSION_TOO_OLD)
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
            <Button
              variant="secondary"
              onClick={() =>
                deleteSetting("rootDir").then(() => window.location.reload())
              }
            >
              Select different directory
            </Button>
          </CardFooter>
        </Card>
      </FullCentered>
    );

  if (directoryState === DirectoryState.MAJOR_VERSION_TOO_NEW)
    return (
      <FullCentered>
        <Card className="md:min-w-lg min-w-sm ">
          <CardHeader>
            <CardTitle>Directory uses a newer Version</CardTitle>
            <CardDescription>
              The Directory you selected uses a newer version of this app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please use the new version of the app.</p>
          </CardContent>
          <CardFooter className="space-x-2">
            <Button asChild>
              <a
                href={`https://v${rootMetaVersion?.major}.${import.meta.env.VITE_PROD_DOMAIN}`}
              >
                Use new app version (v{rootMetaVersion?.major})
              </a>
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                deleteSetting("rootDir").then(() => window.location.reload())
              }
            >
              Select different directory
            </Button>
          </CardFooter>
        </Card>
      </FullCentered>
    );

  if (loadingRootDir)
    return (
      <FullCentered>
        <p className="text-zinc-400 animate-pulse">
          Loading jeopardy directory...
        </p>
      </FullCentered>
    );

  if (rootDir === null)
    return (
      <FullCentered>
        <JeopardyDirectoryChooser />
      </FullCentered>
    );

  if (directoryState === null) return;
  <FullCentered>
    <p className="text-zinc-400 animate-pulse">
      Checking jeopardy directory...
    </p>
  </FullCentered>;

  if (directoryState === DirectoryState.VALID)
    return (
      <RootContext.Provider value={rootDir}> {children}</RootContext.Provider>
    );

  // exhaustive check
  const leftoverState: never = directoryState;
  throw new Error("unhandled case: " + leftoverState);
}

export function useRootDir() {
  return useContext(RootContext);
}
