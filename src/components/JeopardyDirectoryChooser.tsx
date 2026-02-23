import { db, type JeopardyDirectory } from "@/indexedDB/db";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight02Icon, Directory } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Item, ItemActions, ItemContent, ItemMedia } from "./ui/item";
import { Button } from "./ui/button";

export default function DirectoryChooser() {
  const { data: recentDirectories, refetch } = useQuery({
    queryKey: [],
    queryFn: async () =>
      await db.jeopardyDirectories
        .toArray()
        .then((arr) =>
          arr.sort((a, b) => a.lastUsed.getTime() - b.lastUsed.getTime()),
        ),
  });

  const [directoryListRef] = useAutoAnimate();

  const uploadDirectory = async () => {
    const handle = await window.showDirectoryPicker().catch(() => null);
    if (!handle) return toast.error("No directory selected");

    const prom = new Promise<JeopardyDirectory>(async (resolve, reject) => {
      // store in db
      const id = await db.jeopardyDirectories.add({
        handle,
        lastUsed: new Date(),
      } as JeopardyDirectory);
      //
      const entry = await db.jeopardyDirectories.get(id);
      if (!entry) return reject();

      resolve(entry);
    });

    toast.promise(prom, {
      loading: "Storing Directory",
      error: "Error while storing directory",
      success: "Directory stored",
    });

    const directory = await prom;
    refetch();
  };

  const removeDirectory = async (dir: JeopardyDirectory) => {
    const prom = new Promise<void>((resolve) =>
      db.jeopardyDirectories.delete(dir.id).then(resolve),
    );

    toast.promise(prom, {
      loading: "removing directory...",
      error: "error while removing directory",
      success: `removed: "${dir.handle.name}"`,
    });

    await prom;
    refetch();
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="text-3xl font-bold">Choose your Jeopardy-Directory</h2>
        </CardHeader>
        <CardContent ref={directoryListRef}>
          {recentDirectories &&
            recentDirectories.length > 0 &&
            recentDirectories.map((entry) => (
              <Item variant="outline">
                <ItemMedia>
                  <HugeiconsIcon icon={Directory} />
                </ItemMedia>
                <ItemContent>{entry.handle.name}</ItemContent>
                <ItemActions>
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={() => removeDirectory(entry)}
                  >
                    remove
                  </Button>
                  <Button variant="outline" size="sm">
                    <div>
                      <Link
                        to="/dir/$dirId"
                        params={{
                          dirId: entry.id.toString(),
                        }}
                      >
                        Select
                      </Link>
                    </div>
                    <HugeiconsIcon icon={ArrowRight02Icon} />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          <Button className="mt-4" onClick={uploadDirectory}>
            Select new Jeopardy Directory <HugeiconsIcon icon={Directory} />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
