import { ROOT_META_DEFAULT_CONTENT, ROOT_META_FILE_NAME } from "./rootMeta";
import { countEntries } from "./utils";
import { toast } from "sonner";

export async function initNewJFDirectory(
  directoryHandle: FileSystemDirectoryHandle,
) {
  if ((await countEntries(directoryHandle)) !== 0)
    throw Error("directory is not empty");

  // create files and directories
  const [metaHandle] = await Promise.all([
    directoryHandle.getFileHandle(ROOT_META_FILE_NAME, { create: true }),
    directoryHandle.getDirectoryHandle("categories", { create: true }),
    directoryHandle.getDirectoryHandle("boards", { create: true }),
    directoryHandle.getDirectoryHandle("games", { create: true }),
  ]).catch(async (reason) => {
    // cleanup directory
    await Promise.allSettled([
      directoryHandle.removeEntry(ROOT_META_FILE_NAME),
      directoryHandle.removeEntry("categories"),
      directoryHandle.removeEntry("boards"),
      directoryHandle.removeEntry("games"),
    ]);

    console.error(reason);
    throw Error("Could not initialize jeopardy directory");
  });

  // write meta file
  const writable = await metaHandle.createWritable();
  await writable.write(JSON.stringify(ROOT_META_DEFAULT_CONTENT));
  await writable.close();

  toast.success("Successfully initialized Jeopardy Directory");
}
